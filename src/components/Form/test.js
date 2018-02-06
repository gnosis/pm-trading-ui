import React, { Component } from 'react'

import { reduxForm, Field } from 'redux-form'

import {
  Checkbox,
  TextInput,
  TextInputAdornment,
} from './'

class FormTest extends Component {
  render() {
    return (
      <form>
        <h1>Gnosis Management Form Test</h1>

        <Field name="termsAgree" component={Checkbox} label="Do you agree with the terms and conditions?">I Agree</Field>

        <Field name="name" component={TextInput} label="What's your name?" />

        <Field name="adornmentTest" component={TextInput} label="How much do you wish to pay?" endAdornment={<TextInputAdornment position="end">Test</TextInputAdornment>} />
      </form>
    )
  }
}

export default reduxForm({ form: 'Test' })(FormTest)
