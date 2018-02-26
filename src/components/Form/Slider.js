import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import classNames from 'classnames/bind'

import InputError from './InputError'
import TextInput from './TextInput'
import css from './Slider.mod.scss'

const cx = classNames.bind(css)

const Slider = ({
  input,
  meta: { touched, error },
  label,
  min,
  max,
  showInput,
  showDefaultUnit,
  step,
  unit,
  muted,
}) => {
  const valueElement = showInput ? (
    <TextInput
      className={cx('formSliderValueInput')}
      input={input}
      meta={{}} // avoid double error message
      type="number"
      min={min}
      max={max}
      step={step}
    />
  ) : (
    <span>{input.value} {unit}</span>
  )

  const inputId = `formSlider_${input.name}`
  const sliderClasses = cx('formSlider', {
    error: (touched && error),
    muted,
  })

  return (
    <div className={sliderClasses}>
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
      <InputError error={touched && error} />
    </div>
  )
}

Slider.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  decimals: PropTypes.number,
  unit: PropTypes.string,
  showDefaultUnit: PropTypes.bool,
  showInput: PropTypes.bool,
  muted: PropTypes.bool,
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
  muted: false,
}

export default Slider
