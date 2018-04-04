import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import classNames from 'classnames/bind'

import RadioButton from './RadioButton'
import InputError from './InputError'

import styles from './RadioButtonGroup.mod.scss'

const cx = classNames.bind(styles)

const RadioButtonGroup = ({
  options, input, className, label, meta, meta: { error, touched }, ...props
}) => (
  <div className={cx('formRadioButtonGroup', className, {
    error: (touched && error),
  })}
  >
    <label>{label}</label>
    {options.map(option => (
      <RadioButton
        key={JSON.stringify(option.value)}
        value={option.value}
        label={option.label}
        input={input}
        meta={meta}
        {...props}
      />
    ))}
    <InputError error={touched && error} />
  </div>
)

RadioButtonGroup.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
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
