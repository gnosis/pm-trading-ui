import React from 'react'

import { Field } from 'redux-form'

import Input from 'components/FormInput'

const OutcomeScalar = () => (
  <div className="outcomeScalar">
    <div className="row">
      <div className="col-md-12">
        <Field name="upperBound" component={Input} label="Upperbound" type="number" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="lowerBound" component={Input} label="Lowerbound" type="number" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="unit" component={Input} label="Unit" />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="decimals" component={Input} label="Number of significant decimals" placeholder="2" />
      </div>
    </div>
  </div>
)

export default OutcomeScalar
