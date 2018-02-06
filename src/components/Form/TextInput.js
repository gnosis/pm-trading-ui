import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldPropTypes } from 'redux-form'

import styles from './TextInput.scss'

const cx = classNames.bind(styles)

const TextInput = ({
  input,
  label,
  type,
  className,
  placeholder,
  meta: { touched, error },
  startAdornment,
  endAdornment,
}) => {
  const showErrorMessage = touched && error
  const inputId = `formTextInput_${input.name}`

  return (
    <div className={cx('textInput', className)}>
      <label htmlFor={inputId}>
        {label}
      </label>
      <div className={cx('inputWrapper')}>
        {startAdornment}
        <input
          id={inputId}
          autoComplete="off"
          placeholder={placeholder}
          type={type}
          {...input}
        />
        {endAdornment}
      </div>
      {showErrorMessage && <span>{error}</span>}
    </div>
  )
}

TextInput.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
}

TextInput.defaultProps = {
  label: '',
  type: 'text',
  className: undefined,
  placeholder: '',
  startAdornment: undefined,
  endAdornment: undefined,
}

export default TextInput
