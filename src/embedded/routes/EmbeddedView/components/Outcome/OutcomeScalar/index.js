import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import { calcLMSRMarginalPrice } from '../utils'
import TrendingOutcomeScalar from './TrendingOutcomeScalar'

import style from './outcomeScalar.scss'

const cx = cn.bind(style)

const OutcomeScalar = ({
  resolved: showOnlyWinningOutcome,
  outcomeTokensSold,
  funding,
  upperBound,
  lowerBound,
  unit,
  decimals: decimalsRaw,
  winningOutcome,
  opts: { showOnlyTrendingOutcome, className = '' },
}) => {
  let marginalPrice = calcLMSRMarginalPrice({
    netOutcomeTokensSold: outcomeTokensSold,
    funding,
    outcomeTokenIndex: 1, // always calc for long when calculating estimation
  })

  const decimals = Math.max(decimalsRaw, 0)

  const lower = Decimal(lowerBound).div(10 ** decimals)
  const upper = Decimal(upperBound).div(10 ** decimals)

  const bounds = Decimal(upper).sub(lower)
  let value = Decimal(marginalPrice)
    .times(bounds)
    .add(lower)

  const currentValueStyle = { left: `${marginalPrice.mul(100).toFixed(5)}%` }

  if (showOnlyWinningOutcome) {
    value = Decimal(winningOutcome).div(10 ** decimals)
    marginalPrice = value.div(upperBound)
  }

  if (showOnlyTrendingOutcome) {
    return <TrendingOutcomeScalar predictedValue={value} decimals={decimals} unit={unit} />
  }

  return (
    <div className={className}>
      <div className={cx('scalarOutcome')}>
        <div className={cx('outcomeBound', 'lower')}>
          {lower.toNumber().toLocaleString()}
          &nbsp;
          {unit}
        </div>
        <div className={cx('currentPrediction')}>
          <div className={cx('currentPredictionLine')} />
          <div className={cx('currentPredictionValue')} style={currentValueStyle}>
            <DecimalValue value={value} decimals={decimals} />
            &nbsp;
            {unit}
          </div>
        </div>
        <div className={cx('outcomeBound', 'upper')}>
          {upper.toNumber().toLocaleString()}
          &nbsp;
          {unit}
        </div>
      </div>
    </div>
  )
}

OutcomeScalar.propTypes = {
  resolved: PropTypes.bool.isRequired,
  upperBound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lowerBound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
  outcomeTokensSold: PropTypes.array.isRequired,
  funding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  winningOutcome: PropTypes.number,
  opts: PropTypes.shape({
    showOnlyTrendingOutcome: PropTypes.bool,
  }),
}

OutcomeScalar.defaultProps = {
  winningOutcome: undefined,
  opts: {
    showOnlyTrendingOutcome: false,
  },
}

export default OutcomeScalar
