import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount, calcLMSRMarginalPrice } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'

import ScalarSlider from 'components/ScalarSlider'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketBuySharesForm.less'

class MarketBuySharesForm extends Component {
  @autobind
  handleBuyShares(values) {
    const {
      market,
      buyShares,
      selectedCategoricalOutcome,
      selectedBuyInvest,
    } = this.props

    console.log(selectedBuyInvest, selectedCategoricalOutcome)

    buyShares(market, selectedCategoricalOutcome, selectedBuyInvest)
  }

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
    return shareCost.div(1e18).toFixed(4)
  }

  getPercentageWin(shareCost, investment) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return '0'
    }

    const invest = new Decimal(investment).mul(1e18)
    return shareCost.div(invest.toString()).mul(100).sub(100).toFixed(4)
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
    console.log(shareCost.toString())

    const maximumWin = this.getMaximumWin(shareCost, selectedBuyInvest)
    const percentageWin = this.getPercentageWin(shareCost, selectedBuyInvest)

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">Bet Amount & Checkout</h2>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-8">
                  <Field name="invest" component={Input} className="marketBuyInvest" placeholder="Investment" />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    {collateralToken}
                  </div>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Maximum Win
                  </div>
                <div className="col-md-6">
                  <span className="marketBuyWin__row marketBuyWin__max">
                    {maximumWin} ({percentageWin} %) {collateralToken}
                  </span>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-12">
                  <Field name="confirm" component={Checkbox} className="marketBuyCheckbox" text="Confirm Purchase" />
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                  <button className="btn btn-primary col-md-12">Buy Shares</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketBuySharesForm__cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>)
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    } else if (event.type === OUTCOME_TYPES.SCALAR) {
      return this.renderScalar()
    } else {
      return (
        <div className="col-md-6">
          <span>Invalid Outcomes...</span>
        </div>
      )
    }
  }

  renderCategorical() {
    const { market: { eventDescription } } = this.props

    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">Preview & Setting</h2>
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
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderScalar() {
    const {
      selectedBuyInvest,
      market: {
        event: {
          lowerBound,
          upperBound,
        },
        eventDescription: {
          decimals,
          unit,
        },
        netOutcomeTokensSold,
        funding,
      },
    } = this.props

    const shareCost = this.getShareCost(selectedBuyInvest, 1)
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold,
      funding,
      outcomeTokenIndex: 1,
    })
    
    // debugger
    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">Preview & Setting</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ScalarSlider
              lowerBound={lowerBound}
              upperBound={upperBound}
              unit={unit}
              decimals={decimals}
              marginalPriceCurrent={marginalPrice}
              marginalPriceSelected={newMarginalPrice}
              selectedCost={shareCost}
            />
          </div>
        </div>
      </div>
    )
  }
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)
