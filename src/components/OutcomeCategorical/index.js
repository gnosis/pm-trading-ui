import React, { PropTypes } from 'react'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import { calcLMSRMarginalPrice } from 'api'
import Decimal from 'decimal.js'

import './outcomeCategorical.less'

const OutcomeCategorical = ({ market, opts = {} }) => {
  const renderOutcomes = market.eventDescription.outcomes
  const { showOnlyTrendingOutcome } = opts
  const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold,
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed()
  })

  if (showOnlyTrendingOutcome && !market.oracle.isOutcomeSet) {
    const tokenDistributionInt = tokenDistribution.map(outcome => parseInt(parseFloat(outcome) * 10000, 10))
    const trendingOutcomeIndex = tokenDistributionInt.indexOf(Math.max(...tokenDistributionInt))
    return (
      <div className="outcomes outcomes--categorical">
        <div key={trendingOutcomeIndex} className="outcome">
          <div className="outcome__bar">
            <div
              className="outcome__bar--inner"
              style={{ width: `${tokenDistribution[trendingOutcomeIndex] * 100}%`, backgroundColor: COLOR_SCHEME_DEFAULT[trendingOutcomeIndex] }}
            >
              <div className="outcome__bar--label">
                { renderOutcomes[trendingOutcomeIndex] }
                <div className="outcome__bar--value">{ `${Math.round(tokenDistribution[trendingOutcomeIndex] * 100).toFixed(0)}%` }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (<div className="outcomes outcomes--categorical">
    {renderOutcomes.map((outcome, outcomeIndex) => {
      if (market.oracle.isOutcomeSet && market.oracle.outcome !== outcomeIndex) {
        return <div key={outcomeIndex} className="outcome" />
      }

      return (
        <div key={outcomeIndex} className="outcome">
          <div className="outcome__bar">
            <div
              className="outcome__bar--inner"
              style={{ width: `${tokenDistribution[outcomeIndex] * 100}%`, backgroundColor: COLOR_SCHEME_DEFAULT[outcomeIndex] }}
            >
              <div className="outcome__bar--label">
                { renderOutcomes[outcomeIndex] }
                <div className="outcome__bar--value">{ `${Math.round(tokenDistribution[outcomeIndex] * 100).toFixed(0)}%` }</div>
              </div>
            </div>
          </div>
        </div>
      )
    })}
  </div>)
}

OutcomeCategorical.propTypes = {
  market: marketShape,
}

export default OutcomeCategorical
