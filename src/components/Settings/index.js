import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import EditableKeyValueList from 'components/FormEditableKeyValueList'
/* USEFUL FOR THE NEXT SETTINGS STEP
import GenericForm from './genericForm'
import ModeratorsForm from './moderatorsForm'*/


class Settings extends Component {

  _renderForm() {
    const { handleSubmit, pristine, reset, submitting } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <FieldArray name="settings" component={renderSettings} />
          </div>
        </div>
      </form>
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

const renderField = ({ input, label, type, className, placeholder, meta: { touched, error } }) =>
  <div className={`inputField ${className || ''}`}>
    <label htmlFor={input.name} className={`inputField__label ${className ? `${className}__label` : ''}`}>{ label }</label>
    <input
      className={`inputField__input ${className ? `${className}__input` : ''}`}
      placeholder={placeholder}
      type={`${type || 'text'}`}
      {...input}
    />
    {touched &&
      error &&
      <span>
        {error}
      </span>}
  </div>

const renderSettings = ({ fields, meta: { error, submitFailed } }) =>
      <div className="row">
        <div className="col-md-12">
          <button type="button" onClick={() => fields.push({})} className="btn">
            {fields.getAll() && fields.getAll().length > 0 ? 'ADD ANOTHER' : 'ADD'}
          </button>
        <div>
      </div>
      {fields.map((item, index) =>
        <div className="row" key={index}>
          <div className="col-md-12">
            <h4>
              Setting #{index + 1}
            </h4>
            <Field
              name={`${item}.key`}
              type="text"
              component={renderField}
              label="KEY"
            />
            <Field
              name={`${item}.value`}
              type="text"
              component={renderField}
              label="VALUE"
            />
            <button
              className="btn btn-primary"
              type="button"
              title="Remove"
              onClick={() => fields.remove(index)}
            >
              REMOVE
            </button>
          </div>
        </div>
      )}
      {fields.getAll() && fields.getAll().length > 0 ?
        <div className="row">
          <div className="col-md-4">
            <button type="submit" className="btn">
              Save settings
            </button>
          </div>
        </div>
        : <div />
      }
      </div>
    </div>


const form = {
  form: 'settingsForm',
  asyncBlurFields: []
}

export default reduxForm(form)(Settings)
