import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import FormInput from 'components/FormInput'

import './marketResolveForm.less'

class MarketResolveForm extends Component {
  @autobind
  handleResolve(values) {
    const { market: { event: { type }, eventDescription: { decimals } } } = this.props

    const { selectedOutcome, selectedValue } = values

    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.props.resolveMarket(this.props.market, selectedOutcome)
    } else if (type === OUTCOME_TYPES.SCALAR) {
      const outcome = Decimal(selectedValue).times(10 ** decimals)
      return this.props.resolveMarket(this.props.market, outcome.trunc())
    }

    throw new Error(`got unexpected type ${type}`)
  }
  renderResolveScalar() {
    const { handleSubmit } = this.props

    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveScalar">
          <Field name="selectedValue" component={FormInput} label={'Enter outcome'} />
        </div>
        <button type="submit" className="btn btn-primary">
          Resolve Oracle
        </button>
      </form>
    )
  }

  renderResolveCategorical() {
    const { handleSubmit, market: { eventDescription: { outcomes } } } = this.props
    console.log(this.props);
    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveCategorical">
          <FormRadioButtonLabel label="Choose outcome" />
          {outcomes.map((outcome, outcomeIndex) => (
            <Field
              key={outcomeIndex}
              className="marketResolveFormRadio"
              name="selectedOutcome"
              component={FormRadioButton}
              text={outcome}
              radioValue={outcomeIndex}
            />
          ))}
        </div>
        <button type="submit" className="btn btn-primary">
          Resolve Oracle
        </button>
      </form>
    )
  }

  render() {
    const { submitting, market: { event: { type }, oracle: { isOutcomeSet } } } = this.props

    if (submitting) {
      console.log('SUBMITTING')
      return <span>Resolving Oracle...</span>
    }

    if (isOutcomeSet) {
      console.log('isOutComeSet')
      return <span>Oracle already resolved</span>
    }

    if (type === OUTCOME_TYPES.SCALAR) {
      console.log('SCALAR')
      return this.renderResolveScalar()
    } else if (type === OUTCOME_TYPES.CATEGORICAL) {
      console.log('Categorical')
      console.log(this.renderResolveCategorical())
      return this.renderResolveCategorical()
    }

    return <span>Something went wrong. Please reload the page</span>
  }
}

MarketResolveForm.propTypes = {
  market: marketShape,
  submitting: PropTypes.bool,
  resolveMarket: PropTypes.func,
  handleSubmit: PropTypes.func,
}

const FORM = {
  form: 'MarketResolveForm',
}

export default reduxForm(FORM)(MarketResolveForm)
