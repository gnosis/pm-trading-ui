import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import { marketShape } from 'utils/shapes'
import { calcLMSRMarginalPrice } from 'api'
import TrendingOutcomeScalar from './TrendingOutcomeScalar'

import style from './outcomeScalar.mod.scss'

const cx = cn.bind(style)

const OutcomeScalar = ({
  resolved,
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

  const showOnlyWinningOutcome = resolved

  const decimals = parseInt(decimalsRaw, 10)

  const upper = Decimal(upperBound).div(10 ** decimals)
  const lower = Decimal(lowerBound).div(10 ** decimals)

  const bounds = upper.sub(lower)
  let value = Decimal(marginalPrice.toString())
    .times(bounds)
    .add(lowerBound)

  if (showOnlyWinningOutcome) {
    value = Decimal(winningOutcome).div(10 ** decimals)
    marginalPrice = value.div(upperBound)
  }

  if (showOnlyTrendingOutcome) {
    return (
      <TrendingOutcomeScalar
        predictedValue={value}
        decimals={decimals}
        unit={unit}
      />
    )
  }

  return (
    <div className={className}>
      <div className={cx('scalarOutcome')}>
        <div className={cx('outcomeBound', 'lower')}>
          <DecimalValue value={lowerBound} decimals={decimals} />
          &nbsp;{unit}
        </div>
        <div className={cx('currentPrediction')}>
          <div className={cx('currentPredictionLine')} />
          <div className={cx('currentPredictionValue')} style={{ left: `${marginalPrice.mul(100).toFixed(5)}%` }}>
            <DecimalValue value={value} decimals={decimals} />
            &nbsp;{unit}
          </div>
        </div>
        <div className={cx('outcomeBound', 'upper')}>
          <DecimalValue value={upperBound} decimals={decimals} />
          &nbsp;{unit}
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
