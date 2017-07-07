import React from 'react'
import { isNumber } from 'lodash'

import './formSlider.less'

const Slider = ({ input, input: { value }, label, type, min, max, decimals, unit }) => {
  let displayValue = parseFloat(value)

  if (Number.isNaN(displayValue)) {
    displayValue = 0
  }
  return (
    <div className="formSlider">
      <label htmlFor={input.name} className="formSlider__label">{ label }</label>
      <label className="formSlider__range--min">{min.toFixed(0)}</label>
      <input className="formSlider__input fluid" type="range" min={min} max={max} {...input} step="0.01" />
      <label className="formSlider__range--max">{max.toFixed(0)}</label>
      <label className="formSlider__value">{(displayValue).toFixed(decimals || 2)} {unit}</label>
    </div>
  )
}

export default Slider
