import React from 'react'

import './formCheckbox.less'

import { bemifyClassName } from 'utils/helpers'

const Checkbox = ({ input, label, type, text, className }) => (
  <div className={`checkboxField ${bemifyClassName(className)}`}>
    <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__label ${bemifyClassName(className, 'label')}`}>{ label }</label>
    <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__text ${bemifyClassName(className, 'text')}`}>
      <input id={`formCheckbox_${input.name}`} className={`checkboxField__input ${bemifyClassName(className, 'input')}`} type="checkbox" {...input} />
      <span className={`checkboxField__textWrapper ${bemifyClassName(className, 'textWrapper')}`}>{ text }</span>
    </label>
  </div>
  )

export default Checkbox
