import React from 'react'

import './formInput.less'

import { bemifyClassName } from 'utils/helpers'

const Input = ({ input, label, type, className, placeholder }) => (
  <div className={`inputField ${bemifyClassName(className)}`}>
    <label htmlFor={input.name} className={`inputField__label ${bemifyClassName(className, 'label')}`}>{ label }</label>
    <input
      className={`inputField__input ${bemifyClassName(className, 'input')}`}
      placeholder={placeholder}
      type={`${type || 'text'}`}
      {...input}
    />
  </div>
  )

export default Input
