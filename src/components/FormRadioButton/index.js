import React from 'react'
import PropTypes from 'prop-types'

import { bemifyClassName } from 'utils/helpers'

import './formRadioButton.less'

const FormRadioButton = ({ input, radioValue, text, className, highlightColor }) => (
  <div className={`radioButton ${bemifyClassName(className)}`}>
    <input
      type="radio"
      className={`radioButton__input ${bemifyClassName(className, 'input')}`}
      id={`radioButton_${input.name}_${radioValue}`}
      style={highlightColor ? { color: highlightColor } : {}}
      onChange={input.onChange}
      checked={input && input.value === radioValue.toString()}
      value={radioValue}
    />
    <label className={`radioButton__text ${bemifyClassName(className, 'text')}`} htmlFor={`radioButton_${input.name}_${radioValue}`}>
      {text}
    </label>
  </div>
)

FormRadioButton.propTypes = {
  input: PropTypes.object,
  radioValue: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  highlightColor: PropTypes.string,
}

export default FormRadioButton

export const FormRadioButtonLabel = ({ label, className }) => (
  <label className={`radioButton__label ${bemifyClassName(className, 'label')}`}>
    {label}
  </label>
)

FormRadioButtonLabel.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
}
