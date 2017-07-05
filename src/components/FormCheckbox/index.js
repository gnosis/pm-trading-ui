import React from 'react'

import './formCheckbox.less'

const Checkbox = ({ input, label, type, text }) => {
  return (
    <div className="checkboxField">
      <label htmlFor={`formCheckbox_${input.name}`} className="checkboxField__label">{ label }</label>
      <label htmlFor={`formCheckbox_${input.name}`} className="checkboxField__text">
        <input id={`formCheckbox_${input.name}`} className="checkboxField__input" type="checkbox" {...input} />
        { text }
      </label>
    </div>
  )
}

export default Checkbox
