import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import Input from 'components/FormInput'


class Settings extends Component {

  renderForm() {
    return (
      <form>
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
        {this.renderForm()}
      </div>
    )
  }
}

const renderSettings = ({ fields, meta: { error } }) =>
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
              component={Input}
              label="NAME"
              placeholder="George"
            />
            <Field
              name={`${item}.value`}
              type="text"
              component={Input}
              label="ADDRESS"
              placeholder="0x12e87B8CE41184E0688027f370A972A436ABE34e"
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
      </div>
    </div>

// TODO move validate functions to a generic utilities file
const validate = values => {
  const errors = {}
  const settingsErrors = []
  console.log('Validating...')
  values.settings.forEach((item, index) => {
    const error = {}
    if (!item.key || item.key.length < 3) {
      error.key = 'Required'
      settingsErrors[index] = error
    }
    if (!item.value) {
      error.value = 'Required'
      settingsErrors[index] = error
    }
    else if (item.value.length != 42 || item.value.substr(0, 2) != '0x') {
      error.value = 'Invalid Ethereum address'
      settingsErrors[index] = error
    }
  })

  if (settingsErrors.length > 0) {
    errors.settings = settingsErrors
  }

  return errors
}


const form = {
  form: 'settingsForm',
  asyncBlurFields: [],
  validate
}

export default reduxForm(form)(Settings)
