import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import autobind from 'autobind-decorator'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import Input from 'components/FormInput'

import './marketBuySharesForm.less'

class MarketBuySharesForm extends Component {
  @autobind
  handleBuyShares(values) {
    const { buyShares, market } = this.props

    buyShares(market, values.outcome, parseFloat(values.invest))
  }

  render() {
    const { market: { event } } = this.props

    if (event.type === 'CATEGORICAL') {
      return this.renderCategorical()
    } else {
      return <span>Unknwon Event Type {event.type}</span>
    }
  }

  renderCategorical() {
    const { handleSubmit, market: { eventDescription } } = this.props

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
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
            <div className="col-md-6">
              <Field name="invest" component={Input} className="marketBuyInvest" placeholder="Investment" />
              <button className="btn btn-primary">Buy Shares</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)
