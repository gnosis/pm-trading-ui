import React, { PropTypes } from 'react'

import { Field } from 'redux-form'

import * as validators from 'utils/validators'

import Input from 'components/FormInput'

const OutcomeScalar = () => (
  <div className="outcomeScalar">
    <div className="row">
      <div className="col-md-12">
        <Field name="unit" component={Input} label="Unit" validate={validators.required} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="decimals" component={Input} label="Number of significant decimals" type="number" placeholder="2" validate={validators.all(validators.required, validators.isNumber({ realOnly: true }))} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="upperBound" component={Input} label="Upperbound" validate={validators.all(validators.required, validators.isNumber({ decimalsProp: 'decimals' }))} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="lowerBound" component={Input} label="Lowerbound" validate={validators.all(validators.required, validators.isNumber({ decimalsProp: 'decimals' }))} />
      </div>
    </div>
  </div>
)

OutcomeScalar.propTypes = {
  decimals: PropTypes.number,
}

export default OutcomeScalar
