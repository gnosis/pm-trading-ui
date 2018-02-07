import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import classNames from 'classnames'

import TextInput from './TextInput'
import styles from './Slider.scss'

const cx = classNames.bind(styles)

const Slider = ({
  input,
  label,
  min,
  max,
  showInput,
  showDefaultUnit,
  step,
  unit,
}) => {
  const valueElement = showInput ? (
    <TextInput className="formSliderValueInput" {...input} type="number" min={min} max={max} step={step} />
  ) : (
    <span>{input.value} {unit}</span>
  )

  const inputId = `formSlider_${input.name}`

  return (
    <div className={cx('formSlider')}>
      <label htmlFor={inputId} className={cx('formSliderLabel')}>
        {label}
      </label>
      <div className={cx('formSliderInputContainer')}>
        <label className={cx('formSliderLabel', 'min')}>{min.toFixed(0)}</label>
        <input
          type="range"
          id={inputId}
          min={min}
          max={max}
          {...input}
          step={step}
        />
        <label className={cx('formSliderLabel', 'max')}>{max.toFixed(0)}</label>
      </div>
      <div className={cx('formSliderContainer', { showDefaultUnit })}>
        {valueElement}
      </div>
    </div>
  )
}

Slider.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  decimals: PropTypes.number,
  unit: PropTypes.string,
  showDefaultUnit: PropTypes.bool,
  showInput: PropTypes.bool,
}

Slider.defaultProps = {
  label: '',
  min: 0,
  max: 100,
  step: 0.01,
  decimals: 2,
  unit: '%',
  showInput: false,
  showDefaultUnit: false,
}

export default Slider
