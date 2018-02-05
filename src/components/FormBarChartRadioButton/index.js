import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import { fieldPropTypes } from 'redux-form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { calcLMSRMarginalPrice } from 'api'
import DecimalValue from 'components/DecimalValue'

import './formBarChartRadioButton.scss'

const FormBarChartRadioButton = ({
  input,
  radioValues,
  label,
  meta: { error, touched },
  market,
  selectedOutcome,
  outcomeTokenCount,
}) => {
  const outcomeTokensSold = [...market.netOutcomeTokensSold]
  const renderOutcomes = market.eventDescription.outcomes

  if (typeof selectedOutcome !== 'undefined') {
    outcomeTokensSold[selectedOutcome] = Decimal(market.netOutcomeTokensSold[selectedOutcome])
      .add(outcomeTokenCount)
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
    <div className={`formBarChartRadioButtons ${touched && error ? 'formBarChartRadioButton--error' : ''}`}>
      {label && <label>{label}</label>}
      {radioValues.map(({ label: radioLabel, value, highlightColor }) => {
        const id = `formBarChartRadioButton_${input.name}_${value}`
        const probability = tokenDistribution[value] * 100
        const style = { color: highlightColor, backgroundColor: COLOR_SCHEME_DEFAULT[value] }
        const lineStyle = { width: `${probability}%` }
        const isInputChecked = input && input.value.toString() === value.toString()
        const onChangeFunc = () => input.onChange(value)
        return (
          <div key={value} className="formBarChartRadioButton">
            <div className="outcome">{radioLabel}</div>
            <div className="formBarChartRadioButton__wrapper">
              <input
                type="radio"
                className="formBarChartRadioButton__input"
                style={style}
                id={id}
                onChange={onChangeFunc}
                checked={isInputChecked}
                value={value}
              />
              <label
                className="formBarChartRadioButton__text outcomes outcomes--categorical"
                htmlFor={id}
              >
                <div className="formBarChartRadioButton__outcome" style={lineStyle}>
                  <div className="outcome__bar--inner pull-left" style={style} />
                </div>
                <DecimalValue value={probability} decimals={2} />%
              </label>
            </div>
          </div>
        )
      })}
      {touched && error && <span>{error}</span>}
    </div>
  )
}

FormBarChartRadioButton.propTypes = {
  ...fieldPropTypes,
  radioValues: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  className: PropTypes.string,
  highlightColor: PropTypes.string,
  selectedOutcome: PropTypes.number,
  outcomeTokenCount: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Decimal)]),
}

export default FormBarChartRadioButton
