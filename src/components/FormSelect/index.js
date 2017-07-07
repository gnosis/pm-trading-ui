import React from 'react'

export default ({ input, meta, label, values, labelClassName, defaultValue, ...props }) => (
  <div className="input__selectedField--labeled">
    <label htmlFor={input.name} className={labelClassName}>{label}</label>
    <select {...input} {...props}>
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
