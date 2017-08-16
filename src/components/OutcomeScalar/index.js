import React, { PropTypes } from 'react'
import Decimal from 'decimal.js'

import DecimalValue from 'components/DecimalValue'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import { calcLMSRMarginalPrice } from 'api'

import './outcomeScalar.less'

const OutcomeScalar = ({ market }) => {
  const marginalPrice = calcLMSRMarginalPrice({
    netOutcomeTokensSold: market.netOutcomeTokensSold,
    // This is a temporary fix to avoid NaN when there is no funding, which should never occour
    funding: Decimal(parseInt(market.funding, 10) || 1e18),
    outcomeTokenIndex: 1, // always calc for long when calculating estimation
  })

  const decimals = parseInt(market.eventDescription.decimals, 10)

  const upperBound = Decimal(market.event.upperBound).div(10 ** decimals)
  const lowerBound = Decimal(market.event.lowerBound).div(10 ** decimals)

  const bounds = upperBound.sub(lowerBound)
  const value = Decimal(marginalPrice.toString()).times(bounds).add(lowerBound)

  return (
    <div className="outcomes outcomes--scalar">
      <div className="outcome">
        <div className="outcome__bound outcome__bound--lower"><DecimalValue value={lowerBound} decimals={1} /></div>
        <div className="outcome__currentPrediction">
          <div className="outcome__currentPrediction--line" />
          <div className="outcome__currentPrediction--value" style={{ left: `${marginalPrice.mul(100).toFixed(5)}%` }}>{value.toString()}</div>
        </div>
        <div className="outcome__bound outcome__bound--upper"><DecimalValue value={upperBound} decimals={1} /></div>
      </div>
    </div>
  )
}

OutcomeScalar.propTypes = {
  market: marketShape,
}

export default OutcomeScalar
