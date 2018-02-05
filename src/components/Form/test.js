import React, { Component } from 'react'

import { reduxForm, Field } from 'redux-form'

import Checkbox from './Checkbox'

class FormTest extends Component {
  render() {
    return (
      <form>
        <h1>Gnosis Management Form Test</h1>

        <Field name="termsAgree" component={Checkbox} label="Do you agree with the terms and conditions?" text="I Agree" />
      </form>
    )
  }
}

export default reduxForm({ form: 'Test' })(FormTest)
