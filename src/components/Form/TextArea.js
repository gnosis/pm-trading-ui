import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldPropTypes } from 'redux-form'

import TextareaAutosize from 'react-autosize-textarea'

import InputError from './InputError'
import styles from './TextArea.scss'

const cx = classNames.bind(styles)

const TextArea = ({
  input,
  label,
  className,
  meta: { touched, error },
}) => {
  const textAreaClasses = cx('formTextArea', className, {
    error: (touched && error) !== false,
  })

  return (
    <div className={textAreaClasses}>
      <label htmlFor={input.name}>
        {label}
      </label>
      <TextareaAutosize {...input} />
      <InputError error={touched && error} />
    </div>
  )
}

TextArea.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
}

TextArea.defaultProps = {
  label: '',
  className: '',
}

export default TextArea
