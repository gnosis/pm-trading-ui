import React from 'react'

import { bemifyClassName } from 'utils/helpers'

export default ({ input, meta, label, values, labelClassName, className, defaultValue, ...props }) => (
  <div className={`selectField ${bemifyClassName(className)}`}>
    <label htmlFor={input.name} className={`selectField__label ${bemifyClassName(className, 'label')}`}>{label}</label>
    <select {...input} {...props} className={`selectField__input ${bemifyClassName(className, 'input')}`}>
      {Object.keys(values).map(key => (
        <option
          key={key}
          value={key}
          defaultValue={defaultValue != null && defaultValue === key}
        >
          {values[key]}
        </option>
      ))}
    </select>
  </div>
)
