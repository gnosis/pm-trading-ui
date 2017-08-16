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

    let currentTokenCount
    try {
      currentTokenCount = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: share.balance,
      })
    } catch (e) {
      currentTokenCount = Decimal('0')
    }

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

    const currentValue = currentTokenCount.mul(currentProbability.toString())
    const newValue = newTokenCount.mul(newProbability.toString())

    /*
    console.log('balance', Decimal(share.balance).div(1e18).toString())
    console.log('currentProb', currentProbability.toString())
    console.log('currentCount', currentTokenCount.toString())
    console.log('newProb', newProbability.toString())
    console.log('newCount', newTokenCount.toString())
    */

    const diffTokenValue = newValue.sub(currentValue.toString())

    return [
      (<tr key={'sellViewHeading'} className="marketMyShares__sell marketMyShares__sell--heading">
        <th />
        <th />
        <th>Token Count</th>
        <th>New Value</th>
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
          <DecimalValue value={newValue.div(1e18)} />&nbsp;
          <CurrencyName collateralToken={market.event.collateralToken} />&nbsp;
          {!diffTokenValue.isZero() && <span>
            (<span className={`marketMyShares__diff ${diffTokenValue.gt(0) ? 'marketMyShares__diff--positive' : 'marketMyShares__diff--negative'}`}>
              {diffTokenValue.gt(0) ? '+' : ''}<DecimalValue value={diffTokenValue.div(1e18)} />&nbsp;
              <CurrencyName collateralToken={market.event.collateralToken} />
            </span>)
          </span>}
        </td>
        <td>
          <button type="button" className={`btn btn-primary ${invalid ? 'disabled' : ''}`} disabled={invalid} onClick={e => this.handleSellShare(e, extendedSellIndex, selectedSellAmount)}>Sell Shares</button>
          <button type="button" className="btn btn-link" onClick={this.handleCloseSellView}>Cancel</button>
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
            {!resolved && <a href="javascript:void(0);" onClick={e => this.handleShowSellView(e, shareIndex)}>Sell</a>}
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
