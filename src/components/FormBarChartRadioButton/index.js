import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { fieldPropTypes } from 'redux-form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { bemifyClassName } from 'utils/helpers'
import { calcLMSRMarginalPrice } from 'api'
import DecimalValue from 'components/DecimalValue'
import Decimal from 'decimal.js'

import './formBarChartRadioButton.less'

const FormBarChartRadioButton = ({
  input,
  radioValues,
  label,
  className,
  meta: { error, touched },
  market,
  selectedOutcome,
  selectedBuyInvest,
}) => {
  const outcomeTokensSold = [...market.netOutcomeTokensSold]
  const renderOutcomes = market.eventDescription.outcomes
  let selectedBuyInvestWei

  if (selectedBuyInvest && parseInt(selectedBuyInvest) < 1000) {
    selectedBuyInvestWei = Decimal(selectedBuyInvest)
      .mul(1e18)
      .toString()
    outcomeTokensSold[selectedOutcome] = Decimal(market.netOutcomeTokensSold[selectedOutcome])
      .add(selectedBuyInvestWei)
      .toString()
  }

  const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: outcomeTokensSold,
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed()
  })

  return (
    <div className={`outcome formBarRadioButton ${touched && error ? 'formBarRadioButton--error' : ''}`}>
      {label && <label>{label}</label>}
      {radioValues.map(({ label: radioLabel, value, highlightColor }) => {
        const probability = tokenDistribution[value] * 100
        const style = { width: `${probability}%`, backgroundColor: COLOR_SCHEME_DEFAULT[value] }
        return (
          <div key={value} className="outcome__bar">
            <input
              type="radio"
              className={`outcome__bar--inner pull-left barRadioButton__input ${bemifyClassName(className, 'input')}`}
              id={`barRadioButton_${input.name}_${value}`}
              style={highlightColor ? { ...style, color: highlightColor } : style}
              onChange={() => input.onChange(value)}
              checked={input && input.value.toString() === value.toString()}
              value={value}
            />
            <label
              className={`barRadioButton__text ${bemifyClassName(className, 'text')}`}
              htmlFor={`barRadioButton_${input.name}_${value}`}
            >
              {radioLabel}&nbsp;
              <DecimalValue value={probability} decimals={2} />%
            </label>
          </div>
        )
      })}
      {touched && error && <span>{error}</span>}
    </div>
  )
}

FormBarChartRadioButton.propTypes = {
  ...fieldPropTypes,
  radioValues: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  className: PropTypes.string,
  highlightColor: PropTypes.string,
  selectedOutcome: PropTypes.number,
  selectedBuyInvest: PropTypes.string,
}

export default FormBarChartRadioButton
