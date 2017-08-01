import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
// import autobind from 'autobind-decorator'
import GenericForm from './genericForm'
import ModeratorsForm from './moderatorsForm'


class Settings extends Component {

  _renderForm() {
    return (
      <div>
        <GenericForm {...this.props} />
        <ModeratorsForm {...this.props} />
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
