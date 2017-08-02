import React from 'react'

import './formInput.less'

import { bemifyClassName } from 'utils/helpers'

const Input = ({ input, meta: { error }, label, type, className, placeholder }) => (
  <div className={`inputField ${bemifyClassName(className)}`}>
    <label htmlFor={input.name} className={`inputField__label ${bemifyClassName(className, 'label')}`}>{ label }</label>
    <input
      className={`inputField__input ${bemifyClassName(className, 'input')} ${error ? `inputField__input--error ${bemifyClassName(className, 'input', 'error')}` : ''}`}
      placeholder={placeholder}
      type={`${type || 'text'}`}
      {...input}
    />
    {error && <span>{error}</span>}
  </div>
  )

export default Input
