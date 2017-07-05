import React from 'react'

import './formRadioButton.less'

const FormRadioButton = ({ input, radioValue, text }) => (
  <div className="radioButton">
    <input
      type="radio"
      className="radioButton__input"
      id={`radioButton_${input.name}_${radioValue}`}
      onChange={input.onChange}
      checked={input && input.value === radioValue}
      value={radioValue}
    />
    <label className="radioButton__text" htmlFor={`radioButton_${input.name}_${radioValue}`}>
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
