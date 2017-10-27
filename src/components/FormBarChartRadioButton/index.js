import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import { fieldPropTypes } from 'redux-form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { calcLMSRMarginalPrice } from 'api'
import DecimalValue from 'components/DecimalValue'

import './formBarChartRadioButton.less'

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
      .add(outcomeTokenCount.toString())
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
        const probability = tokenDistribution[value] * 100
        const style = { color: highlightColor, backgroundColor: COLOR_SCHEME_DEFAULT[value] }
        return (
          <div key={value} className="formBarChartRadioButton">
            <input
              type="radio"
              className="formBarChartRadioButton__input"
              style={style}
              id={`formBarChartRadioButton_${input.name}_${value}`}
              onChange={() => input.onChange(value)}
              checked={input && input.value.toString() === value.toString()}
              value={value}
            />
            <label
              className={'formBarChartRadioButton__text outcomes outcomes--categorical'}
              htmlFor={`formBarChartRadioButton_${input.name}_${value}`}
            >
              <div className="formBarChartRadioButton__outcome" style={{ width: `${probability}%` }}>
                <div
                  className="outcome__bar--inner pull-left"
                  style={style}
                />
              </div>
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
<<<<<<< HEAD
  outcomeTokenCount: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Decimal)]),
=======
  outcomeTokenCount: PropTypes.object,
>>>>>>> 171184551dfeb4bea9000d5764679318db1ef1aa
}

export default FormBarChartRadioButton
