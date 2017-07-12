import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import autobind from 'autobind-decorator'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketBuySharesForm.less'

class MarketBuySharesForm extends Component {
  @autobind
  handleBuyShares(values) {
    const { buyShares, market } = this.props

    buyShares(market, values.outcome, parseFloat(values.invest))
  }

  render() {
    const { handleSubmit, market: { event: { collateralToken } } } = this.props

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
                    <span className="marketBuyWin__row marketBuyWin__max">28€ (0.07) ETH</span> {/* TODO: calculate this */}
                    <span className="marketBuyWin__row marketBuyWin__min">20€ (0.05) ETH</span> {/* TODO: calculate this */}
                  </div>
                </div>
                <div className="row marketBuySharesForm__row">
                  <div className="col-md-6">Share Count</div>
                  <div className="col-md-6">3</div> {/* TODO: fetch this */}
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
            name="outcome"
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
    const { market: { eventDescription } } = this.props

    // TODO: missing template from vianney
    return (
      <div className="col-md-6">
        <Field name="outcome" component={Input} label="Value" />
      </div>
    )
  }
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)
