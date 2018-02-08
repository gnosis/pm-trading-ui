import React, { Component } from 'react'

import { reduxForm, Field } from 'redux-form'

import {
  Checkbox,
  TextInput,
  Select,
  TextInputAdornment,
  TextArea,
  RadioButtonGroup,
  Slider,
  OutcomeSelection,
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

const OUTCOME_SELECTION = [
  {
    index: 0, label: 'Option A', probability: 23.12, color: 'rgb(224, 21, 99)',
  },
  {
    index: 1, label: 'Option B', probability: 76.88, color: 'rgb(11, 225, 177)',
  },
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

        <Field name="inputSlider" component={Slider} showInput label="How awesome is this?" />

        <Field name="textarea" component={TextArea} label="Write an essay on how well this works" />

        <Field name="outcomeSelection" component={OutcomeSelection} label="Select an Outcome" outcomes={OUTCOME_SELECTION} />
      </form>
    )
  }
}
/* eslint-enable */

export default reduxForm({ form: 'Test' })(FormTest)
