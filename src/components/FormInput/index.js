import React from 'react'

import './formInput.less'

const Input = ({ input, label, type, className, placeholder }) => {
  return (
    <div className={`inputField ${className || ''}`}>
      <label htmlFor={input.name} className={`inputField__label ${`${className}__label` || ''}`}>{ label }</label>
      <input
        className={`inputField__input ${`${className}__input` || ''}`}
        placeholder={placeholder}
        type={`${type || 'text'}`}
        {...input}
      />
    </div>
  )
}

export default Input
