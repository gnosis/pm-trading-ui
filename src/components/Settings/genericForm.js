import React, { Component } from 'react'
import { Field } from 'redux-form'
import Input from 'components/FormInput'

export default class GenericForm extends Component {

  _renderForm() {
    const { handleSubmit } = this.props
    return (
      <div className="settings__form">
        <h3>General</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-offset-2 col-md-10">
              <Field name="title" component={Input} type="text" label="Title" onChange={this._handleOnChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-2 col-md-10">
              <Field name="description" component={Input} type="text" label="Description" onChange={this._handleOnChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-2 col-md-10">
              <Field name="subdomain" component={Input} type="text" label="Subdomain" onChange={this._handleOnChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-2 col-md-4">
              <button
                className="btn btn-default btn-default--muted"
                type="submit"
              >
              Save
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  render() {
    return (this._renderForm())
  }

}
