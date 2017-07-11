import React from 'react'

import './formRadioButton.less'

const FormRadioButton = ({ input, radioValue, text, className, highlightColor }) => (
  <div className={`radioButton ${className || ''}`}>
    <input
      type="radio"
      className={`radioButton__input ${`${className}__input` || ''}`}
      id={`radioButton_${input.name}_${radioValue}`}
      style={highlightColor ? { color: highlightColor } : {}}
      onChange={input.onChange}
      checked={input && input.value === radioValue.toString()}
      value={radioValue}
    />
    <label className={`radioButton__text ${`${className}__text` || ''}`} htmlFor={`radioButton_${input.name}_${radioValue}`}>
      {text}
    </label>
  </div>
)

export default FormRadioButton

export const FormRadioButtonLabel = ({ label }) => (
  <label className="radioButton__label">
    {label}
  </label>
)
