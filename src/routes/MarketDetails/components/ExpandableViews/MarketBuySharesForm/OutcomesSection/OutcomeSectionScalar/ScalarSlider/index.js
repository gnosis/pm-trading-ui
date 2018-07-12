import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import cn from 'classnames/bind'
import { decimalToText } from 'components/DecimalValue'
import style from './scalarSlider.mod.scss'

const cx = cn.bind(style)

const ScalarSlider = ({
  lowerBound, upperBound, unit, marginalPriceCurrent, marginalPriceSelected, decimals,
}) => {
  const bigLowerBound = new Decimal(lowerBound)
  const bigUpperBound = new Decimal(upperBound)

  // for the value we show atleast 2 decimalplaces, so users can see a change when they enter an investment
  const displayDecimals = Math.max(decimals, 0)
  const bounds = bigUpperBound.sub(bigLowerBound).div(10 ** decimals)

  // current value
  const value = new Decimal(marginalPriceCurrent).mul(bounds).add(bigLowerBound.div(10 ** displayDecimals))
  const percentage = new Decimal(marginalPriceCurrent).mul(100)

  const selectedValue = new Decimal(marginalPriceSelected).mul(bounds).add(bigLowerBound.div(10 ** displayDecimals))
  const selectedPercentage = new Decimal(marginalPriceSelected).mul(100)

  const currentValueSliderStyle = { left: `${percentage.toFixed(4)}%` }
  const selectedValueSliderStyle = { left: `${selectedPercentage.toFixed(4)}%` }
  const selectedHandleStyle = cx('sliderHandle', 'selected')

  return (
    <div className={cx('scalarSlider')}>
      <div className={cx('inner')}>
        <div className={cx('lowerBound')}>
          <div className={cx('boundValue')}>
            {`${bigLowerBound.div(10 ** decimals).toFixed(0)} ${unit}`}
          </div>
          <div className={cx('boundLabel')}>
            Lower Bound
          </div>
        </div>
        <div className={cx('bar')} title="Please enter a value on the right!">
          <div className={cx('sliderHandle')} style={currentValueSliderStyle}>
            <div className={cx('handleText')}>
              <div className={cx('handleTextLabel')}>
                Predicted Outcome
              </div>
              <div className={cx('handleTextValue')}>
                {`${decimalToText(value.toFixed(displayDecimals))} ${unit}`}
              </div>
            </div>
          </div>
          <div className={selectedHandleStyle} style={selectedValueSliderStyle}>
            <div className={cx('handleText')}>
              <div className={cx('handleTextLabel')}>
                Selected Trade
              </div>
              <div className={cx('handleTextValue')}>
                {`${decimalToText(selectedValue)} ${unit}`}
              </div>
            </div>
          </div>
        </div>
        <div className={cx('upperBound')}>
          <div className={cx('boundValue')}>
            {`${bigUpperBound.div(10 ** decimals).toFixed(0)} ${unit}`}
          </div>
          <div className={cx('boundLabel')}>
            Upper Bound
          </div>
        </div>
      </div>
    </div>
  )
}

ScalarSlider.propTypes = {
  lowerBound: PropTypes.number,
  upperBound: PropTypes.number,
  unit: PropTypes.string,
  marginalPriceCurrent: PropTypes.string,
  marginalPriceSelected: PropTypes.string,
  decimals: PropTypes.number,
}

export default ScalarSlider
