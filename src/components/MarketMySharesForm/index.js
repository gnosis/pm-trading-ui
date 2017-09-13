import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, propTypes } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount, calcLMSRProfit } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import FormInput from 'components/FormInput'
import FormCheckbox from 'components/FormCheckbox'

import { COLOR_SCHEME_DEFAULT, GAS_COST } from 'utils/constants'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import { marketShape } from 'utils/shapes'

import './marketMySharesForm.less'

class MarketMySharesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      extendedSellIndex: undefined,
    }
  }

  componentWillMount() {
    const { gasCosts, gasPrice, requestGasCost, requestGasPrice } = this.props

    if (gasCosts.sellShares === undefined) {
      requestGasCost(GAS_COST.SELL_SHARES)
    }
    if (gasPrice === undefined) {
      requestGasPrice()
    }
  }

  @autobind
  handleShowSellView(e, shareIndex) {
    e.preventDefault()
    this.props.reset()
    this.setState({ extendedSellIndex: (shareIndex === this.state.extendedSellIndex ? undefined : shareIndex) })
  }

  @autobind
  handleCloseSellView(e) {
    e.preventDefault()
    this.props.reset()
    this.setState({ extendedSellIndex: undefined })
  }

  @autobind
  handleSellShare(shareIndex, shareAmount) {
    return this.props.sellShares(this.props.market, shareIndex, shareAmount)
      .then(() => this.props.reset())
  }

  @autobind
  validateTokenCount(val, values, props) {
    let decimalValue
    try {
      decimalValue = Decimal(val || 0)
    } catch (e) {
      return 'Invalid Number value'
    }

    if (decimalValue.lt(0)) {
      return 'Number can\'t be negative.'
    }

    if (decimalValue.gt(Decimal(props.marketShares[this.state.extendedSellIndex].balance).div(1e18).toString())) {
      return 'You\'re trying to sell more than you invested.'
    }

    return undefined
  }


  renderSellShareView() {
    const { extendedSellIndex } = this.state
    const {
      market,
      isConfirmedSell,
      invalid,
      submitting,
      submitFailed,
      selectedSellAmount,
      handleSubmit,
      marketShares: {
        [extendedSellIndex]: share,
      },
      gasCosts,
      gasPrice,
    } = this.props

    let selectedSellAmountWei
    try {
      selectedSellAmountWei = new Decimal(parseFloat(selectedSellAmount) || 0).mul(1e18).toString()
    } catch (e) {
      selectedSellAmountWei = '0'
    }
    let currentProbability
    try {
      currentProbability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
    } catch (e) {
      currentProbability = new Decimal(0)
    }

    const currentTokenCount = share && share.balance ? new Decimal(share.balance) : new Decimal(0)
    const newTokenCount = currentTokenCount.sub(new Decimal(selectedSellAmount || 0))
    let earnings = new Decimal(0)
    if (share.balance && selectedSellAmount) {
      earnings = weiToEth(calcLMSRProfit({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        outcomeTokenCount: selectedSellAmountWei,
        feeFactor: market.fee,
      }))
    }

    const newNetOutcomeTokensSold = market.netOutcomeTokensSold.map((outcomeTokenAmount, outcomeTokenIndex) => {
      if (outcomeTokenIndex === share.outcomeToken.index && !currentTokenCount.sub(newTokenCount.toString()).isZero()) {
        return Decimal(outcomeTokenAmount).sub(currentTokenCount.sub(newTokenCount.toString()).toString()).toString()
      }

      return Decimal(outcomeTokenAmount).toString()
    })

    let newProbability
    try {
      newProbability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: newNetOutcomeTokensSold,
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
    } catch (e) {
      newProbability = currentProbability
    }

    // const earnings = selectedSellAmount && parseFloat(selectedSellAmount) > 0 ? newTokenCount.mul(currentProbability).div(1e18) : new Decimal(0)

    const submitDisabled = invalid || submitting || !isConfirmedSell
    const gasCostEstimation = weiToEth(gasPrice.mul(gasCosts.sellShares))

    return (
      <div className="marketMyShares__sellContainer">
        <form onSubmit={handleSubmit(() => this.handleSellShare(extendedSellIndex, selectedSellAmount))}>
          <div className="row marketMyShares__sellRow">
            <div className="col-md-3 col-md-offset-3 marketMyShares__sellColumn">
              <label>Amount to Sell</label>
              <Field
                component={FormInput}
                name="sellAmount"
                placeholder="Enter Token Amount"
                className="marketMySharesSellAmount"
                validate={this.validateTokenCount}
              />
            </div>
            <div className="col-md-3 marketMyShares__sellColumn">
              <label>New Probability</label>
              <span>
                <DecimalValue value={newProbability.mul(100)} /> %
              </span>
            </div>
            <div className="col-md-3">
              <label>Earnings</label>
              <span>
                <DecimalValue value={earnings} />
                <CurrencyName collateralToken={market.event.collateralToken} />
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-md-offset-3">
              <label>Gas costs</label>
              <span>
                <DecimalValue value={gasCostEstimation} />&nbsp;
                <CurrencyName collateralToken={market.event.collateralToken} />
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-6 marketMyShares__sellColumn">
              <Field name="confirm" component={FormCheckbox} className="marketMySharesSellButton" text="Confirm Sell" />
              <button className={`btn btn-primary ${submitDisabled ? 'disabled' : ''}`} disabled={submitDisabled}>{submitting ? 'Loading' : 'Sell Shares'}</button>
              <button type="button" className="btn btn-link" onClick={this.handleCloseSellView}>Cancel</button>
            </div>
          </div>
          {submitFailed && (
          <div className="row">
            <div className="col-md-9 col-md-offset-3 marketMyShares__errorColumn">
              Sorry - your share sell could not be processed. Please ensure you&quot;re on the right network.
            </div>
          </div>)}
        </form>
      </div>
    )
  }

  generateTableRows() {
    const tableRows = []

    const { marketShares, market } = this.props
    const { extendedSellIndex } = this.state

    const resolved = market.oracle.isOutcomeSet || market.event.isWinningOutcomeSet

    marketShares.forEach((share, shareIndex) => {
      const probability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
      const maximumWin = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: share.balance,
      })

      tableRows.push((
        <tr className="marketMyShares__share" key={share.id}>
          <td>
            <div
              className={'shareOutcome__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[share.outcomeToken.index] }}
            />
          </td>
          <td className="">
            {getOutcomeName(market, share.outcomeToken.index)}
          </td>
          <td>
            <DecimalValue value={Decimal(share.balance).div(1e18)} />
          </td>
          <td>
            <DecimalValue value={maximumWin.mul(probability).div(1e18)} />&nbsp;
            <CurrencyName collateralToken={market.event.collateralToken} />
          </td>
          <td>
            {/* eslint-disable no-script-url */}
            {!resolved && <a href="javascript:void(0);" className="marketMyShares__sellButton" onClick={e => this.handleShowSellView(e, shareIndex)}>Sell</a>}
            {/* eslint-enable no-script-url */}
          </td>
        </tr>
      ))

      if (shareIndex === extendedSellIndex) {
        tableRows.push((
          <tr className="marketMyShares__sellView" key={`${share.id}__sell`}>
            <td colSpan={5}>
              {this.renderSellShareView()}
            </td>
          </tr>
        ))
      }
    })

    return tableRows
  }

  render() {
    const { marketShares } = this.props

    if (!marketShares || !marketShares.length) {
      return (
        <div className="marketMyShares">
          <h2 className="marketMyShares__heading">
            You don&apos;t hold any shares for this market.
            <br />
            <small>It may take some time for the blockchain to mine your share purchase.</small>
          </h2>
        </div>
      )
    }

    return (
      <div className="marketMyShares">
        <h2 className="marketMyShares__heading">My Shares</h2>
        <table className="table marketMyShares__shareTable">
          <thead>
            <tr>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Token Count</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Current Value</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group" />
            </tr>
          </thead>
          <tbody>
            {this.generateTableRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

MarketMySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  isConfirmedSell: PropTypes.bool,
  selectedSellAmount: PropTypes.string,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(MarketMySharesForm)
