import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'


import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import FormRadioButton from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketShortSellForm.less'
import '../MarketBuySharesForm/marketBuySharesForm.less'

class MarketShortSellForm extends Component {

  getShareCost(investment, outcomeIndex) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return new Decimal(0)
    }

    const invest = new Decimal(investment).mul(1e18)
    const {
      market: {
        funding,
        netOutcomeTokensSold,
      },
    } = this.props

    let shareCost
    try {
      shareCost = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold,
        funding,
        outcomeTokenIndex: parseInt(outcomeIndex, 10),
        cost: invest.toString(),
      })
    } catch (e) {
      return new Decimal(0)
    }

    return shareCost
  }

  getMaximumWin(shareCost) {
    return shareCost.div(1e18)
  }

  getPercentageWin(shareCost, investment) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return '0'
    }

    const invest = new Decimal(investment).mul(1e18)
    return shareCost.div(invest.toString()).mul(100).sub(100)
  }

  @autobind
  handleShortSell() {
    // TODO
  }

  @autobind
  handleSelectOutcome(event) {
    event.preventDefault
    console.log(event.target.value)
    // TODO develop
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    }

    return (
      <div className="col-md-4">
        <span>Invalid Outcomes...</span>
      </div>
    )
  }

  renderCategorical() {
    const { market: { eventDescription } } = this.props
    
    return (
      <div className="col-md-4">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">SELECT  OUTCOME</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {eventDescription.outcomes.map((label, index) => (
              <Field
                key={index}
                component={FormRadioButton}
                name="selectedOutcome"
                highlightColor={COLOR_SCHEME_DEFAULT[index]}
                className="marketBuyOutcome"
                radioValue={index}
                text={label}
                onChange={this.handleSelectOutcome}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }  

  render() {
    const {
      handleSubmit,
      selectedBuyInvest,
      market: {
        event: {
          type: eventType,
          collateralToken,
        },
      },
    } = this.props

    let outcomeIndex

    if (eventType === OUTCOME_TYPES.CATEGORICAL) {
      outcomeIndex = this.props.selectedCategoricalOutcome
    } else if (eventType === OUTCOME_TYPES.SCALAR) {
      outcomeIndex = 0 // short
    }

    const shareCost = this.getShareCost(selectedBuyInvest, outcomeIndex)

    const maximumWin = this.getMaximumWin(shareCost, selectedBuyInvest)
    const percentageWin = this.getPercentageWin(shareCost, selectedBuyInvest)

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleShortSell)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">YOUR BET</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-8">
                  <Field name="amount" component={Input} className="marketSellAmount" placeholder="Enter amount" />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                    Maximum Win
                  </div>
                <div className="col-md-6">
                  <span className="marketBuyWin__row marketBuyWin__max">
                    <DecimalValue value={maximumWin} />
                    (<DecimalValue value={percentageWin} /> %)
                    <CurrencyName collateralToken={collateralToken} />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">CHECKOUT</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-12">
                  <Field name="confirm" component={Checkbox} className="marketBuyCheckbox" 
                    text="I AGREE AND UNDERSTAND THAT ETH WILL BE TRANSFERRED FROM MY ACCOUNT" />
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                  <button className="btn btn-primary">PLACE ORDER</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketShortSell__cancel">DISCARD</button>
                </div>
              </div>                                
            </div>
          </div>
        </form>
      </div>
    )
  }  

}

MarketShortSellForm.propTypes = {
  market: PropTypes.shape({
    address: PropTypes.string,
  }),
  invalid: PropTypes.bool,
  selectedSellAmount: PropTypes.string,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
}

const FORM = {
  form: 'marketShortSell',
}

export default reduxForm(FORM)(MarketShortSellForm)
