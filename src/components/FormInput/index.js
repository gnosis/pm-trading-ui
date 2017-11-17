import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import cn from 'classnames'

import { bemifyClassName } from 'utils/helpers'

import './formInput.less'

const Input = ({
  input,
  label,
  type,
  className,
  placeholder,
  continuousPlaceholder,
  meta: { touched, error },
  ...rest
}) => {
  const showErrorMessage = touched && error

  return (
    <div className={`inputField ${bemifyClassName(className)}`}>
      <label htmlFor={input.name} className={`inputField__label ${bemifyClassName(className, 'label')}`}>
        {label}
      </label>
      <input
        className={cn('inputField__input', {
          [bemifyClassName(className, 'input')]: className,
          'inputField__input--error': showErrorMessage,
          [bemifyClassName(className, 'input', 'error')]: className && showErrorMessage,
        })}
        placeholder={placeholder}
        type={`${type || 'text'}`}
        {...input}
        {...rest}
      />
      {continuousPlaceholder && (
        <input
          className={`inputField__continuousPlaceholder ${bemifyClassName(className, 'continuousPlaceholder')}`}
          type="text"
          value={continuousPlaceholder}
          disabled
        />
      )}
      {showErrorMessage && <span>{error}</span>}
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
