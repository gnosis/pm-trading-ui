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


const form = {
  form: 'settingsForm',
  asyncBlurFields: []
}

export default reduxForm(form)(Settings)
