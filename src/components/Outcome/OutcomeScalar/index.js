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

const OutcomeScalar = ({ market, opts: { showOnlyTrendingOutcome } }) => {
  let marginalPrice = calcLMSRMarginalPrice({
    netOutcomeTokensSold: market.outcomeTokensSold,
    funding: market.funding,
    outcomeTokenIndex: 1, // always calc for long when calculating estimation
  })

  const showOnlyWinningOutcome = market.resolved

  const decimals = parseInt(market.bounds.decimals, 10)

  const upperBound = Decimal(market.bounds.upper).div(10 ** decimals)
  const lowerBound = Decimal(market.bounds.lower).div(10 ** decimals)

  const bounds = upperBound.sub(lowerBound)
  let value = Decimal(marginalPrice.toString())
    .times(bounds)
    .add(lowerBound)

  if (showOnlyWinningOutcome) {
    value = Decimal(market.winningOutcome).div(10 ** decimals)
    marginalPrice = value.div(upperBound)
  }

  if (showOnlyTrendingOutcome) {
    return (
      <TrendingOutcomeScalar
        predictedValue={value}
        decimals={market.bounds.decimals}
        unit={market.bounds.unit}
      />
    )
  }

  return (
    <div>
      <div className={cx('scalarOutcome')}>
        <div className={cx('outcomeBound', 'lower')}>
          <DecimalValue value={lowerBound} decimals={decimals} />
          &nbsp;{market.bounds.unit}
        </div>
        <div className={cx('currentPrediction')}>
          <div className={cx('currentPredictionLine')} />
          <div className={cx('currentPredictionValue')} style={{ left: `${marginalPrice.mul(100).toFixed(5)}%` }}>
            <DecimalValue value={value} decimals={decimals} />
            &nbsp;{market.bounds.unit}
          </div>
        </div>
        <div className={cx('outcomeBound', 'upper')}>
          <DecimalValue value={upperBound} decimals={decimals} />
          &nbsp;{market.bounds.unit}
        </div>
      </div>
    </div>
  )
}

OutcomeScalar.propTypes = {
  market: marketShape,
  opts: PropTypes.shape({
    showOnlyTrendingOutcome: PropTypes.bool,
  }),
}

OutcomeScalar.defaultProps = {
  market: {
    event: {},
    eventDescription: {},
    oracle: {},
  },
  opts: {
    showOnlyTrendingOutcome: false,
  },
}

export default OutcomeScalar
