import React from 'react'

import { Field } from 'redux-form'
import EditableList from 'components/FormEditableList'

const OutcomeCategorical = () => (
  <div className="outcomeCategorical">
    <div className="row">
      <div className="col-md-12">
        <Field name="outcomes" component={EditableList} label="Outcomes" />
      </div>
    </div>
  </div>
)

export default OutcomeCategorical
