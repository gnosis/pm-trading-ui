import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import autobind from 'autobind-decorator'

import './marketResolveForm.less'

import { OUTCOME_TYPES } from 'utils/constants'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'

class MarketResolveForm extends Component {
  @autobind
  handleResolve(values) {
    const { market: { oracle: { address } } } = this.props
    const { selectedOutcome } = values
    return this.props.resolveOracle(address, selectedOutcome)
  }
  renderResolveScalar() {
    return (
      <div className="marketResolve">
        <div className="marketResolveScalar">
          Scalar
        </div>
      </div>
    )
  }

  renderResolveCategorical() {
    const { handleSubmit, market: { eventDescription: { outcomes } } } = this.props

    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveCategorical">
          <FormRadioButtonLabel label="Choose outcome" />
          {outcomes.map((outcome, outcomeIndex) => {
            return (
              <Field key={outcomeIndex} className="marketResolveFormRadio" name="selectedOutcome" component={FormRadioButton} text={outcome} radioValue={outcomeIndex} />
            )
          })}
        </div>
        <button type="submit" className="btn btn-primary">Resolve Oracle</button>
      </form>
    )
  }

  render() {
    const { submitting, market: { event: { type }, oracle: { isOutcomeSet } } } = this.props
    console.log(this.props.market)

    if (submitting) {
      return <span>Resolving Oracle...</span>
    }

    if (isOutcomeSet) {
      return <span>Oracle already resolved</span>
    }

    if (type === OUTCOME_TYPES.SCALAR) {
      return this.renderResolveScalar()
    } else if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderResolveCategorical()
    }

    return <span>Something went wrong. Please reload the page</span>
  }
}

const FORM = {
  form: 'MarketResolveForm',
}

export default reduxForm(FORM)(MarketResolveForm)