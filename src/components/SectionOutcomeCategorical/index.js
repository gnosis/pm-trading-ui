import React from 'react'

import { FieldArray } from 'redux-form'
import OutcomeList from 'components/FormOutcomeList'

const OutcomeCategorical = () => (
  <div className="outcomeCategorical">
    <div className="row">
      <div className="col-md-12">
        <FieldArray
          name="outcomes"
          component={OutcomeList}
          label="Outcomes"
          validate={val => (
            val && val.filter(v => v !== undefined && v.length > 2).length === val.length ? undefined : 'Field is required'
          )}
        />
      </div>
    </div>
  </div>
)

export default OutcomeCategorical
