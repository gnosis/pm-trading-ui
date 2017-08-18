import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import { bemifyClassName } from 'utils/helpers'

import './formRadioButton.less'

const FormRadioButton = ({ input, radioValues, label, className, highlightColor, meta: { error, touched } }) => (
  <div className={`formRadioButton ${touched && error ? 'formRadioButton--error' : ''}`}>
    <label>{label}</label>
    {radioValues.map(({ label, value }) => (
      <div key={value} className={`radioButton ${bemifyClassName(className)}`}>
        <input
          type="radio"
          className={`radioButton__input ${bemifyClassName(className, 'input')}`}
          id={`radioButton_${input.name}_${value}`}
          style={highlightColor ? { color: highlightColor } : {}}
          onChange={input.onChange}
          checked={input && input.value === value.toString()}
          value={value}
        />
        <label className={`radioButton__text ${bemifyClassName(className, 'text')}`} htmlFor={`radioButton_${input.name}_${value}`}>
          {label}
        </label>
      </div>
    ))}
    {touched && error &&
      <span>
        {error}
      </span>}
  </div>
)

FormRadioButton.propTypes = {
  ...fieldPropTypes,
  radioValues: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  className: PropTypes.string,
  highlightColor: PropTypes.string,
}

export default FormRadioButton
