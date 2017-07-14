import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'

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
      selectedBuyInvest,
    } = this.props

    buyShares(market, values.outcome, selectedBuyInvest)
  }

  render() {
    console.log(this.props)
    const {
      handleSubmit,
      selectedCategoricalOutcome,
      selectedBuyInvest,
      market: {
        funding,
        netOutcomeTokensSold,
        event: {
          collateralToken,
        },
      },
    } = this.props


    let maximumWin = 0
    let percentWin = 0
    try {
      if (selectedBuyInvest > 0) {
        const investInWei = new Decimal(selectedBuyInvest).mul(1e18)
        const outcomeTokenIndex = parseInt(selectedCategoricalOutcome, 10)

        const shareCostWei = calcLMSROutcomeTokenCount({
          netOutcomeTokensSold,
          funding,
          outcomeTokenIndex,
          cost: investInWei.toString(),
        })

        maximumWin = shareCostWei.sub(investInWei.toString()).div(1e18)
        percentWin = shareCostWei.div(investInWei.toString()).mul(100).sub(100)
      }
    } catch (err) {
      console.error(err)
    }

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-6">
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
                    {maximumWin.toFixed(2)} (+{percentWin.toFixed(2)} %) {collateralToken}
                  </span>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-12">
                  <Field name="confirm" component={Checkbox} className="marketBuySharesForm__checkbox" text="Confirm Purchase" />
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
    )
  }

  renderScalar() {
    const {
      market: {
        event: {
          lowerBound,
          upperBound
        },
        eventDescription: {
          decimals,
          unit,
        },
      }
    } = this.props
    console.log(this.props.market)
    return (
      <div className="col-md-6">
        <span>{lowerBound} to {upperBound}</span>
        <Field name="outcome" component={Input} label={`Value in ${unit}`} step={Math.pow(10, -(parseInt(decimals, 10))).toFixed(decimals)} />
      </div>
    )
  }
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)
