import React, { PropTypes } from 'react'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import { calcLMSRMarginalPrice } from 'api'

import './outcomeCategorical.less'

const OutcomeCategorical = ({ market, showLeadOnly }) => {
  const renderOutcomes = market.eventDescription.outcomes

  let leadingIndex
  let leadingValue
  const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold,
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    if (!leadingValue || marginalPrice.gt(leadingValue)) {
      leadingIndex = outcomeIndex
      leadingValue = marginalPrice
    }

    return marginalPrice.toFixed()
  })

  return (<div className="outcomes outcomes--categorical">
    {renderOutcomes.map((outcome, outcomeIndex) => {
      if (showLeadOnly && outcomeIndex !== leadingIndex) {
        return <div className="outcome" key={outcomeIndex} />
      }

      return (
        <div key={outcomeIndex} className={`outcome ${showLeadOnly && outcomeIndex === leadingIndex ? 'outcome--leading' : ''}`}>
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
  showLeadOnly: PropTypes.bool,
}

export default OutcomeCategorical
