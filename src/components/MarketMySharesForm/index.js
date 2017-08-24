import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, propTypes } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName, { collateralTokenToText } from 'components/CurrencyName'

import FormInput from 'components/FormInput'
import FormCheckbox from 'components/FormCheckbox'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import './marketMySharesForm.less'

class MarketMySharesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      extendedSellIndex: undefined,
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

  renderSellShareView() {
    const { extendedSellIndex } = this.state
    const {
      market,
      isConfirmedSell,
      invalid,
      submitting,
      selectedSellAmount,
      marketShares: {
        [extendedSellIndex]: share,
      },
    } = this.props

    const enteredSellAmount = typeof selectedSellAmount !== 'undefined' || selectedSellAmount === ''
    let selectedSellAmountWei
    try {
      selectedSellAmountWei = Decimal(selectedSellAmount || 0).mul(1e18).toString()
    } catch (e) {
      selectedSellAmountWei = '0'
    }    
    let currentProbability
    try {
      currentProbability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
    } catch (e) {
      currentProbability = Decimal('0')
    }

    const currentTokenCount = share && share.balance ? new Decimal(share.balance) : new Decimal('0')

    let newTokenCount
    try {
      newTokenCount = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: Decimal(share.balance).sub(selectedSellAmountWei).toString(),
      })
    } catch (e) {
      newTokenCount = currentTokenCount
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

    /*
    const currentValue = currentTokenCount.mul(currentProbability.toString())
    const newValue = newTokenCount.mul(newProbability.toString())

    console.log('balance', Decimal(share.balance).div(1e18).toString())
    console.log('currentProb', currentProbability.toString())
    console.log('currentCount', currentTokenCount.toString())
    console.log('newProb', newProbability.toString())
    console.log('newCount', newTokenCount.toString())

    const diffTokenValue = newValue.sub(currentValue.toString())

    */

    return [
      (<tr key={'sellViewHeading'} className="marketMyShares__sell marketMyShares__sell--heading">
        <th />
        <th />
        <th>Amount to sell</th>
        <th>New Probability</th>
        <th />
      </tr>),
      (<tr key={'sellView'} className="marketMyShares__sell">
        <td colSpan={2} />
        <td>
          <Field
            component={FormInput}
            name="sellAmount"
            placeholder="Enter Token Amount"
            className="marketMySharesSellAmount"
            validate={(val) => {
              let decimalValue
              try {
                decimalValue = Decimal(val || 0)
              } catch (e) {
                return 'Invalid Number value'
              }
              if (decimalValue < 0) {
                return 'Number can\'t be negative.'
              }

              if (decimalValue.gt(Decimal(share.balance).div(1e18).toString())) {
                return 'You\'re trying to sell more than you invested.'
              }

              return undefined
            }}
          />
        </td>
        <td>
          {enteredSellAmount && <span>
            <DecimalValue value={newProbability.mul(100)} /> %
          </span>}
        </td>
        <td />
      </tr>),
      <tr key={'sellView__actions'} className="marketMyShares__sellActions">
        <td colSpan={5}>
          <div className="marketMyShares__actionRow">
            <Field name="confirm" component={FormCheckbox} className="marketMySharesSellButton" text="Confirm Sell" />
            <button className={`btn btn-primary ${invalid ? 'disabled' : ''}`} disabled={invalid || submitting || !isConfirmedSell}>{submitting ? 'Loading' : 'Sell Shares'}</button>
            <button type="button" className="btn btn-link" onClick={this.handleCloseSellView}>Cancel</button>
          </div>
        </td>
      </tr>,
    ]
  }

  render() {
    const { marketShares, market, selectedSellAmount } = this.props
    const { extendedSellIndex } = this.state

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

    const resolved = market.oracle.isOutcomeSet || market.event.isWinningOutcomeSet

    const tableRowElements = marketShares.map((share, shareIndex) => {
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

      return (
        <tr className="marketMyShares__share" key={share.id}>
          <td>
            <div
              className={'shareOutcome__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[share.outcomeToken.index] }}
            />
          </td>
          <td className="">
            {market.eventDescription.outcomes[share.outcomeToken.index]}
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
      )
    })

    if (typeof extendedSellIndex !== 'undefined') {
      tableRowElements.splice(extendedSellIndex + 1, 0, ...this.renderSellShareView())
    }

    return (
      <div className="marketMyShares">
        <form onSubmit={this.props.handleSubmit(() => this.handleSellShare(extendedSellIndex, selectedSellAmount))}>
          <h2 className="marketMyShares__heading">My Shares</h2>
          <table className="table marketMyShares__shareTable">
            <thead>
              <tr>
                <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
                <th className="marketMyShares__tableHeading">Outcome</th>
                <th className="marketMyShares__tableHeading">Token Count</th>
                <th className="marketMyShares__tableHeading">Current Value</th>
                <th className="marketMyShares__tableHeading" />
              </tr>
            </thead>
            <tbody>
              {tableRowElements}
            </tbody>
          </table>
        </form>
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
