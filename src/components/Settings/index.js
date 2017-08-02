import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import EditableKeyValueList from 'components/FormEditableKeyValueList'
/* USEFUL FOR THE NEXT SETTINGS STEP
import GenericForm from './genericForm'
import ModeratorsForm from './moderatorsForm'*/


class Settings extends Component {

  /* renderForm() {
    return (
      <div>
        <GenericForm {...this.props} />
        <ModeratorsForm {...this.props} />
      </div>
    )
  }*/

  _renderForm() {
    return (
      <div className="settings">
        <div className="row">
          <div className="col-md-12">
            <Field name="values" component={EditableKeyValueList} label="VALUE" normalize={val => val.filter(entry => entry.length > 0)} />
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        {this._renderForm()}
      </div>
    )
  }
}

/*const validate = values => {
  const errors = {}
  if (!values.title) {
    errors.title = 'Required'
  }
  if (!values.description) {
    errors.description = 'Required'
  }
  if (!values.subdomain) {
    errors.subdomain = 'Required'
  }
  return errors
}*/

/*const renderField = ({input, label, type, meta: {touched, error, warning}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)*/


const form = {
  form: 'settingsForm',
  asyncBlurFields: []
}

export default reduxForm(form)(Settings)
