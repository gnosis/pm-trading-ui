import React, { Component } from 'react'

import { reduxForm, Field } from 'redux-form'

import {
  Checkbox,
  TextInput,
  Select,
  TextInputAdornment,
  RadioButtonGroup,
  Slider,
} from './'

const FAV_COLOR_VALUES = [
  { value: 'red', label: 'red' },
  { value: 'yellow', label: 'yellow' },
  { value: 'blue', label: 'blue' },
  { value: 'green', label: 'green' },
]

const FAV_TRANSPORT_METHODS = [
  { value: 'bike', label: 'By Bike' },
  { value: 'plane', label: 'By Plane' },
  { value: 'boat', label: 'By Boat' },
  { value: 'car', label: 'By Car' },
]

/* eslint-disable */
class FormTest extends Component {
  render() {
    return (
      <form style={{ marginBottom: '200px'}}>
        <h1>Gnosis Management Form Test</h1>

        <Field name="termsAgree" component={Checkbox} label="Do you agree with the terms and conditions?">I Agree</Field>

        <Field name="name" component={TextInput} label="What's your name?" />

        <Field name="adornmentTest" component={TextInput} label="How much do you wish to pay?" endAdornment={<TextInputAdornment position="end">Test</TextInputAdornment>} />

        <Field name="favColor" component={Select} label="What's your favorite color?" options={FAV_COLOR_VALUES} />

        <Field name="favTransport" component={RadioButtonGroup} label="What's your favorite transportation method?" options={FAV_TRANSPORT_METHODS} />

        <Field name="awesomeness" component={Slider} label="How awesome is this?" />
      </form>
    )
  }
}
/* eslint-enable */

export default reduxForm({ form: 'Test' })(FormTest)
