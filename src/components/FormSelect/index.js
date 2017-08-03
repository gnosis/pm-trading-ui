import React from 'react'
import PropTypes from 'prop-types'
import { pick } from 'lodash'

import { bemifyClassName } from 'utils/helpers'

const FormSelect = ({ input, label, values, labelClassName, className, defaultValue, ...props }) => {
  const selectProps = pick(props, ['className'])

  return (
    <div className={`selectField ${bemifyClassName(className)}`}>
      <label htmlFor={input.name} className={`selectField__label ${bemifyClassName(className, 'label')}`}>{label}</label>
      <select {...input} {...selectProps} className={`selectField__input ${bemifyClassName(className, 'input')}`}>
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
}

const valueType = PropTypes.string

FormSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  values: PropTypes.objectOf(valueType),
  labelClassName: PropTypes.string,
  defaultValue: valueType,
}

export default FormSelect
