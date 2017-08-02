import React from 'react'
import PropTypes from 'prop-types'

import './formCheckbox.less'

import { bemifyClassName } from 'utils/helpers'

const Checkbox = ({ input, label, text, className }) => (
  <div className={`checkboxField ${bemifyClassName(className)}`}>
    <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__label ${bemifyClassName(className, 'label')}`}>{ label }</label>
    <label htmlFor={`formCheckbox_${input.name}`} className={`checkboxField__text ${bemifyClassName(className, 'text')}`}>
      <input id={`formCheckbox_${input.name}`} className={`checkboxField__input ${bemifyClassName(className, 'input')}`} type="checkbox" {...input} />
      <span className={`checkboxField__textWrapper ${bemifyClassName(className, 'textWrapper')}`}>{ text }</span>
    </label>
  </div>
)

Checkbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  text: PropTypes.node,
  className: PropTypes.string,
}

export default Checkbox
