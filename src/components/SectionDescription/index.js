import React from 'react'
import { Field } from 'redux-form'

import Input from 'components/FormInput'
import Textarea from 'components/FormTextarea'

const SectionDescription = () => (
  <div className="sectionDescription">
    <Field component={Input} name="title" label="Title" type="text" />
    <Field component={Textarea} name="description" label="Description" />
    <Field component={Input} name="resolutionDate" label="Resolution Date" type="datetime" />
  </div>
)

export default SectionDescription
