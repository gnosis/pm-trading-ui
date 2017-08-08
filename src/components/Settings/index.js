import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import Input from 'components/FormInput'
import { add0xPrefix } from '../../utils/helpers'


class Settings extends Component {

  renderForm() {
    const { handleSubmit } = this.props

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
        {this.renderForm()}
      </div>
    )
  }
}

const renderSettings = ({ fields, meta: { error } }) =>
      <div className="row">
        <div className="col-md-12">
          <button type="button" onClick={() => fields.push({address: '', name: ''})} className="btn">
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
              normalize={add0xPrefix}
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

const validate = values => {
  const errors = {}
  const settingsErrors = []
  values.settings.forEach((item, index) => {
    const error = {}
    // Name errors
    if (!item.name || item.name.length < 3) {
      error.name = 'Required'
      settingsErrors[index] = error
    }
    const occurrences = values.settings.filter((other) => item.address == other.address)
    // Value Errors
    if (occurrences.length > 1) {
      error.address = 'Duplicated Address'
      settingsErrors[index] = error
    }
    else if (!item.address) {
      error.address = 'Required'
      settingsErrors[index] = error
    }
    else if (item.address.length != 42) {
      error.address = 'Invalid Ethereum address'
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
