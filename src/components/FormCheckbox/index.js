import React from 'react'

import './formCheckbox.less'

const Checkbox = ({ input, label, type, text, className }) => {
  return (
    <div className={`checkboxField ${className ? className : ''}`}>
      <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__label ${className ? className + '__label' : ''}`}>{ label }</label>
      <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__text ${className ? className + '__text' : ''}`}>
        <input id={`formCheckbox_${input.name}`} className={`checkboxField__input ${className ? className + '__input' : ''}`} type="checkbox" {...input} />
        { text }
      </label>
    </div>
  )
}

export default Checkbox
