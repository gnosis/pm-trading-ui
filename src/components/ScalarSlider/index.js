import React, { Component } from 'react'
import Decimal from 'decimal.js'

import './scalarSlider.less'

class ScalarSlider extends Component {
  render() {
    const {
      lowerBound,
      upperBound,
      unit,
      marginalPriceCurrent,
      marginalPriceSelected,
      decimals
    } = this.props

    const bigLowerBound = new Decimal(lowerBound)
    const bigUpperBound = new Decimal(upperBound)

    // current value
    const bounds = bigUpperBound.sub(bigLowerBound).div(10 ** decimals)
    
    const value = marginalPriceCurrent.mul(bounds.toString()).add(bigLowerBound.div(10 ** decimals).toString())
    const percentage = marginalPriceCurrent.mul(100)

    const selectedValue = marginalPriceSelected.mul(bounds.toString()).add(bigLowerBound.div(10 ** decimals).toString())
    const selectedPercentage = marginalPriceSelected.mul(100)

    return (
      <div className="scalarSlider">
        <div className="slider">
          <div className="slider__lowerBound">
            {bigLowerBound.div(10 ** decimals).toFixed(0)} {unit}
            <div className="slider__lowerBoundLabel">Lower Bound</div>
          </div>
          <div className="slider__bar" title="Please enter a value on the right!">
            <div className="slider__handle" style={{ left: `${percentage.toFixed(4)}%` }}>
              <div className="slider__handleText">
                <div className="slider__handleTextLabel">Current Bet</div>
                {value.toFixed(decimals)} {unit}
              </div>
            </div>
              <div className="slider__handle slider__handle--below" style={{ left: `${selectedPercentage.toFixed(4)}%` }}>
                <div className="slider__handleText">
                  <div className="slider__handleTextLabel">Selected Bet</div>
                  {value.toFixed(decimals)} {unit}
                </div>
              </div>
          </div>
          <div className="slider__upperBound">
            {bigUpperBound.div(10 ** decimals).toFixed(0)} {unit}
            <div className="slider__upperBoundLabel">Upper Bound</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ScalarSlider
