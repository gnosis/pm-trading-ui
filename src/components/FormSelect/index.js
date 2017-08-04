import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import { pick } from 'lodash'

import { bemifyClassName } from 'utils/helpers'

const FormSelect = ({ input, label, values, className, defaultValue, ...props }) => {
  const selectProps = pick(props, [])

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
  ...fieldPropTypes,
  label: PropTypes.string,
  values: PropTypes.objectOf(valueType),
  className: PropTypes.string,
  defaultValue: valueType,
}

export default FormSelect
