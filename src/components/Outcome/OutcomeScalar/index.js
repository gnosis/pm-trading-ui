import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'

import DecimalValue from 'components/DecimalValue'

import { marketShape } from 'utils/shapes'

import { calcLMSRMarginalPrice } from 'api'

import './outcomeScalar.scss'

const OutcomeScalar = ({ market, opts: { showOnlyTrendingOutcome } }) => {
  let marginalPrice = calcLMSRMarginalPrice({
    netOutcomeTokensSold: market.netOutcomeTokensSold,
    funding: market.funding,
    outcomeTokenIndex: 1, // always calc for long when calculating estimation
  })
  const showOnlyWinningOutcome = market.oracle.isOutcomeSet && market.oracle.outcome !== undefined

  const decimals = parseInt(market.eventDescription.decimals, 10)

  const upperBound = Decimal(market.event.upperBound).div(10 ** decimals)
  const lowerBound = Decimal(market.event.lowerBound).div(10 ** decimals)

  const bounds = upperBound.sub(lowerBound)
  let value = Decimal(marginalPrice.toString())
    .times(bounds)
    .add(lowerBound)

  if (showOnlyWinningOutcome) {
    value = Decimal(market.oracle.outcome).div(10 ** decimals)
    marginalPrice = value.div(upperBound)
  }

  if (showOnlyTrendingOutcome) {
    return (
      <div className="row">
        <div className="col-md-6">
          <DecimalValue
            value={value}
            decimals={market.eventDescription.decimals}
            className="outcome__currentPrediction--value"
          />
          &nbsp;{market.eventDescription.unit}
        </div>
      </div>
    )
  }

  return (
    <div className="outcomes outcomes--scalar">
      <div className="outcome">
        <div className="outcome__bound outcome__bound--lower">
          <DecimalValue value={lowerBound} decimals={market.eventDescription.decimals} />
          &nbsp;{market.eventDescription.unit}
        </div>
        <div className="outcome__currentPrediction">
          <div className="outcome__currentPrediction--line" />
          <div className="outcome__currentPrediction--value" style={{ left: `${marginalPrice.mul(100).toFixed(5)}%` }}>
            <DecimalValue value={value} decimals={market.eventDescription.decimals} />
            &nbsp;{market.eventDescription.unit}
          </div>
        </div>
        <div className="outcome__bound outcome__bound--upper">
          <DecimalValue value={upperBound} decimals={market.eventDescription.decimals} />
          &nbsp;{market.eventDescription.unit}
        </div>
      </div>
    </div>
  )
}

OutcomeScalar.propTypes = {
  market: marketShape,
  opts: PropTypes.object,
}

export default OutcomeScalar
