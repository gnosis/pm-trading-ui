import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldPropTypes } from 'redux-form'

import InputError from './InputError'
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
  ...props
}) => {
  const inputId = `formTextInput_${input.name}`

  const textInputClasses = cx('formTextInput', className, {
    error: (touched && error) !== false,
  })

  return (
    <div className={textInputClasses}>
      <label htmlFor={inputId}>
        {label}
      </label>
      <div className={cx('wrapper')}>
        {startAdornment}
        <input
          id={inputId}
          autoComplete="off"
          placeholder={placeholder}
          type={type}
          {...input}
          {...props}
        />
        {endAdornment}
      </div>
      <InputError error={touched && error} />
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
