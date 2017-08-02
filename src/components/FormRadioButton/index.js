import React from 'react'

import './formRadioButton.less'

import { bemifyClassName } from 'utils/helpers'

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

export default FormRadioButton

export const FormRadioButtonLabel = ({ label, className }) => (
  <label className={`radioButton__label ${bemifyClassName(className, 'label')}`}>
    {label}
  </label>
)
