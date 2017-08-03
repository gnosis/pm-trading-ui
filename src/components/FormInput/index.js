import React from 'react'
import PropTypes from 'prop-types'

import { bemifyClassName } from 'utils/helpers'

import './formInput.less'

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

Input.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
  }),
}

export default Input
