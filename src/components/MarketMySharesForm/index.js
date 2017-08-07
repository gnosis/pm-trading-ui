import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName, { collateralTokenToText } from 'components/CurrencyName'

import FormInput from 'components/FormInput'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

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
    this.setState({ extendedSellIndex: (shareIndex === this.state.extendedSellIndex ? undefined : shareIndex) })
  }

  @autobind
  handleCloseSellView(e) {
    e.preventDefault()
    this.setState({ extendedSellIndex: undefined })
  }

  @autobind
  handleSellShare(e, shareIndex, shareAmount) {
    e.preventDefault()
    if (window.confirm('Are you sure?')) {
      this.props.sellShares(this.props.market.address, shareIndex, shareAmount)
    }
  }

  renderSellShareView() {
    const { extendedSellIndex } = this.state
    const { invalid, selectedSellAmount, marketShares: { [extendedSellIndex]: share }, market } = this.props

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

    let currentTokenValue
    try {
      currentTokenValue = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: share.balance,
      })
    } catch (e) {
      currentTokenValue = Decimal('0')
    }

    let newTokenValue
    try {
      newTokenValue = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: Decimal(share.balance).sub(selectedSellAmountWei).toString(),
      })
    } catch (e) {
      newTokenValue = currentTokenValue
    }

    const diffTokenValue = currentTokenValue.sub(newTokenValue.toString())

    const newNetOutcomeTokensSold = market.netOutcomeTokensSold.map((outcomeTokenAmount, outcomeTokenIndex) => {
      if (outcomeTokenIndex === share.outcomeToken.index && !diffTokenValue.isZero()) {
        return Decimal(outcomeTokenAmount).sub(diffTokenValue.toString())
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

    const diffProbability = currentProbability.sub(newProbability.toString())

    return [
      (<tr key={'sellViewHeading'} className="marketMyShares__sell marketMyShares__sell--heading">
        <th />
        <th />
        <th>Amount</th>
        <th>New Value</th>
        <th>Probability after Sale</th>
        <th />
      </tr>),
      (<tr key={'sellView'} className="marketMyShares__sell">
        <td colSpan={2} />
        <td>
          <Field
            component={FormInput}
            name="sellAmount"
            placeholder={collateralTokenToText(market.event.collateralToken)}
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
          <DecimalValue value={newTokenValue.div(1e18)} />
          <CurrencyName collateralToken={market.event.collateralToken} />
          {!diffTokenValue.isZero() && <span>
            (<span className={`marketMyShares__diff ${diffTokenValue.gt(0) ? 'marketMyShares__diff--positive' : 'marketMyShares__diff--negative'}`}>
              {diffTokenValue.gt(0) ? '+' : ''}<DecimalValue value={diffTokenValue.div(1e18)} />
              <CurrencyName collateralToken={market.event.collateralToken} />
            </span>)
          </span>}
        </td>
        <td>
          <DecimalValue value={newProbability.mul(100)} /> %
          {!diffProbability.isZero() && <span>
            (<span className={`marketMyShares__diff ${diffProbability.gt(0) ? 'marketMyShares__diff--positive' : 'marketMyShares__diff--negative'}`}>
              {diffProbability.gt(0) ? ' +' : ' '}<DecimalValue value={diffProbability.mul(100)} /> %
            </span>)
          </span>}
        </td>
        <td>
          <button type="button" className="btn btn-link" onClick={this.handleCloseSellView}>Cancel</button>
          <button type="button" className={`btn btn-primary ${invalid ? 'disabled' : ''}`} disabled={invalid} onClick={e => this.handleSellShare(e, extendedSellIndex, selectedSellAmount)}>Sell Shares</button>
        </td>
      </tr>),
    ]
  }

  render() {
    const { marketShares, market } = this.props
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
        <tr className="marketMyShares__share" key={share.address}>
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
            <CurrencyName collateralToken={market.event.collateralToken} />
          </td>
          <td>
            <DecimalValue value={maximumWin.div(1e18)} />
            <CurrencyName collateralToken={market.event.collateralToken} />
          </td>
          <td>
            <DecimalValue value={probability.mul(100)} /> %
          </td>
          <td>
            {/* eslint-disable no-script-url */}
            <a href="javascript:void(0);" onClick={e => this.handleShowSellView(e, shareIndex)}>Sell</a>
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
        <form>
          <h2 className="marketMyShares__heading">My Shares</h2>
          <table className="table marketMyShares__shareTable">
            <thead>
              <tr>
                <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
                <th className="marketMyShares__tableHeading">Outcome</th>
                <th className="marketMyShares__tableHeading">Investment</th>
                <th className="marketMyShares__tableHeading">Current Value</th>
                <th className="marketMyShares__tableHeading">Current Probability</th>
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
  market: PropTypes.shape({
    address: PropTypes.string,
  }),
  invalid: PropTypes.bool,
  selectedSellAmount: PropTypes.string,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(MarketMySharesForm)
