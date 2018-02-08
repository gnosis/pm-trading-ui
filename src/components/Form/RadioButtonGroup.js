import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import classNames from 'classnames/bind'

import RadioButton from './RadioButton'
import InputError from './InputError'

const cx = classNames.bind()

const RadioButtonGroup = ({
  options, input, className, label, meta: { error, touched },
}) => (
  <div className={cx(className)}>
    <label>{label}</label>
    {options.map(option => (
      <RadioButton key={option.value} value={option.value} label={option.label} input={input} />
    ))}
    <InputError error={touched && error} />
  </div>
)

RadioButtonGroup.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.node,
  })),
  label: PropTypes.node,
  className: PropTypes.string,
}

RadioButtonGroup.defaultProps = {
  options: [],
  label: '',
  className: '',
}

export default RadioButtonGroup
