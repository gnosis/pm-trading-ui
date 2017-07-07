import React from 'react'

import './formInput.less'

const Input = ({ input, label, type }) => {
  return (
    <div className="inputField">
      <label htmlFor={input.name} className="inputField__label">{ label }</label>
      <input className="inputField__input" type={`${type || 'text'}`} {...input} />
    </div>
  )
}

export default Input
