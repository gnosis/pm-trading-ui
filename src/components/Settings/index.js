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
          <button type="button" onClick={() => fields.push({key: '', value: ''})} className="btn">
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
              name={`${item}.name`}
              type="text"
              component={Input}
              label="NAME"
              placeholder="George"
            />
            <Field
              name={`${item}.address`}
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
  for (var index=0; index<values.settings.length; index++) {
    const error = {}
    const item = values.settings[index]
    // Name errors
    if (!item.name || item.name.length < 3) {
      error.name = 'Required'
      settingsErrors[index] = error
    }
    const occurrences = values.settings.filter((other) => {return item.address == other.address})
    // Value Errors
    if ( occurrences.length > 1 ) {
      error.address = 'Duplicated Address'
      settingsErrors[index] = error
    }
    else if (!item.address) {
      error.address = 'Required'
      settingsErrors[index] = error
    }
    else if (item.address.length != 42 || item.address.substr(0, 2) != '0x') {
      error.address = 'Invalid Ethereum address'
      settingsErrors[index] = error
    }

  }

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
