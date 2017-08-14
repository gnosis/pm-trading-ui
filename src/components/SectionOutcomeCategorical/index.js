import React from 'react'

import { Field } from 'redux-form'
import EditableList from 'components/FormEditableList'

import { marketShape } from 'utils/shapes'

const OutcomeCategorical = () => (
  <div className="outcomeCategorical">
    <div className="row">
      <div className="col-md-12">
        <Field name="outcomes" component={EditableList} label="Outcomes" normalize={val => val.filter(entry => entry.length > 0)} />
      </div>
    </div>
  </div>
)

OutcomeCategorical.propTypes = {
  market: marketShape,
}

export default OutcomeCategorical
