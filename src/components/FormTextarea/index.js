import React from 'react'
import TextareaAutosize from 'react-autosize-textarea'

import './textareaField.less'

const Input = ({ input, label, type, className }) => {
  return (
    <div className="textareaField">
      <label htmlFor={input.name} className={`textareaField__label ${className ? `${className}__label` : ''}`}>{ label }</label>
      <TextareaAutosize className={`textareaField__input ${className ? `${className}__input` : ''}`} {...input} />
    </div>
  )
}

export default Input
