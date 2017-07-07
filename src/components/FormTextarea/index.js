import React from 'react'
import TextareaAutosize from 'react-autosize-textarea'

import './textareaField.less'

const Input = ({ input, label, type }) => {
  return (
    <div className="textareaField">
      <label htmlFor={input.name} className="textareaField__label">{ label }</label>
      <TextareaAutosize className="textareaField__input" {...input} />
    </div>
  )
}

export default Input
