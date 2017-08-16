import React, { PropTypes } from 'react'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import { calcLMSRMarginalPrice } from 'api'

import './outcomeCategorical.less'

const OutcomeCategorical = ({ market }) => {
  const renderOutcomes = market.eventDescription.outcomes

  const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold,
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed()
  })

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
