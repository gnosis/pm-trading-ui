import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { fieldPropTypes } from 'redux-form'

import './formSlider.less'

const Slider = ({
  input, label, min, max, showInput = true, step = '0.01', showDefaultUnit = false, unit = '%',
}) => {
  let displayValue = parseFloat(input.value)

  if (Number.isNaN(displayValue)) {
    displayValue = 0
  }
  const valueContainerClassname = cn({
    'formSlider__value-container': true,
    showDefaultUnit,
  })

  const valueElement = showInput ? (
    <input className="formSlider__value inputField__input" {...input} type="number" min={min} max={max} step={step} />
  ) : (
    <span>{input.value} {unit}</span>
  )

  return (
    <div className="formSlider">
      <label htmlFor={input.name} className="formSlider__label">
        {label}
      </label>
      <div className="formSlider__slider-container">
        <label className="formSlider__range--min">{min.toFixed(0)}</label>
        <input className="formSlider__input fluid" type="range" min={min} max={max} {...input} step={step} />
        <label className="formSlider__range--max">{max.toFixed(0)}</label>
      </div>
      <div className={valueContainerClassname}>{valueElement}</div>
    </div>
  )
}

Slider.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  decimals: PropTypes.number,
  unit: PropTypes.string,
  showDefaultUnit: PropTypes.bool,
}

export default Slider
