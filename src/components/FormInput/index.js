import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import cn from 'classnames'

import { bemifyClassName } from 'utils/helpers'

import './formInput.less'

const Input = ({
  input,
  label,
  type = 'text',
  className,
  placeholder,
  continuousPlaceholder,
  meta: { touched, error },
  ...rest
}) => {
  const showErrorMessage = touched && error

  const containerClassName = `inputField ${bemifyClassName(className)}`
  const labelClassName = `inputField__label ${bemifyClassName(className, 'label')}`
  const inputClassName = cn('inputField__input', {
    [bemifyClassName(className, 'input')]: className,
    'inputField__input--error': showErrorMessage,
    [bemifyClassName(className, 'input', 'error')]: className && showErrorMessage,
  })
  const placeholderClassName = `inputField__continuousPlaceholder ${bemifyClassName(className, 'continuousPlaceholder')}`
  const errorClassName = `inputField__error ${bemifyClassName(className, 'error')}`

  return (
    <div className={containerClassName}>
      <label htmlFor={input.name} className={labelClassName}>
        {label}
      </label>
      <input className={inputClassName} autoComplete="off" placeholder={placeholder} type={type} {...input} {...rest} />
      {continuousPlaceholder && (
        <input
          className={placeholderClassName}
          type="text"
          value={continuousPlaceholder}
          disabled
        />
      )}
      {showErrorMessage && <span className={errorClassName}>{error}</span>}
    </div>
  )
}

Input.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
}

export default Input
