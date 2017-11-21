import React, { PropTypes } from 'react'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import moment from 'moment'

import { calcLMSRMarginalPrice } from 'api'

import './outcomeCategorical.less'

const OutcomeCategorical = ({ market, opts = {} }) => {
  const renderOutcomes = market.eventDescription.outcomes
  const showOnlyWinningOutcome = market.oracle.isOutcomeSet && market.oracle.outcome !== undefined
  const {
    showOnlyTrendingOutcome, showDate, dateFormat, className,
  } = opts
  const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold,
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed()
  })

  // show only treding outcome
  if (showOnlyTrendingOutcome && !market.oracle.isOutcomeSet) {
    const tokenDistributionInt = tokenDistribution.map(outcome => parseInt(parseFloat(outcome) * 10000, 10))
    const trendingOutcomeIndex = tokenDistributionInt.indexOf(Math.max(...tokenDistributionInt))
    const outcomeEntryStyle = {
      backgroundColor: COLOR_SCHEME_DEFAULT[trendingOutcomeIndex],
    }
    const trendingMarginalPricePercent = market.marginalPrices
      ? Math.round(market.marginalPrices[trendingOutcomeIndex] * 100).toFixed(0)
      : '0'
    const resolutionDateFormatted = showDate ? moment(market.eventDescription.resolutionDate).format(dateFormat) : ''

    return (
      <div className="outcomes outcomes--categorical">
        <div className="entry__color" style={outcomeEntryStyle} />
        <div className="outcome">{renderOutcomes[trendingOutcomeIndex]}</div>
        <div>{trendingMarginalPricePercent}%</div>
        <div className="date">{resolutionDateFormatted}</div>
      </div>
    )
  }

  // show only winning outcome
  if (showOnlyWinningOutcome) {
    const tokenDistributionPercent = `${Math.round(tokenDistribution[market.oracle.outcome] * 100).toFixed(0)}%`

    return (
      <div className={`${className} outcomes outcomes--categorical`}>
        <div className="outcome outcome__winning">
          {renderOutcomes[market.oracle.outcome]}
          <div className="outcome__bar--value">{tokenDistributionPercent}</div>
        </div>
      </div>
    )
  }

  // show all outcomes
  return (
    <div className={`${className} outcomes outcomes--categorical`}>
      {renderOutcomes.map((outcome, outcomeIndex) => {
        if (market.oracle.isOutcomeSet && market.oracle.outcome !== outcomeIndex) {
          return <div key={outcomeIndex} className="outcome" />
        }
        const outcomeBarStyle = {
          width: `${tokenDistribution[outcomeIndex] * 100}%`,
          backgroundColor: COLOR_SCHEME_DEFAULT[outcomeIndex],
        }
        const tokenDistributionPercent = `${Math.round(tokenDistribution[outcomeIndex] * 100).toFixed(0)}%`

        return (
          <div key={outcomeIndex} className="outcome">
            <div className="outcome__bar">
              <div className="outcome__bar--inner" style={outcomeBarStyle}>
                <div className="outcome__bar--label">
                  {renderOutcomes[outcomeIndex]}
                  <div className="outcome__bar--value">{tokenDistributionPercent}</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

OutcomeCategorical.propTypes = {
  market: marketShape,
  opts: PropTypes.shape({
    className: PropTypes.string,
    showOnlyTrendingOutcome: PropTypes.bool,
    showDate: PropTypes.bool,
    dateFormat: PropTypes.string,
  }),
}

export default OutcomeCategorical
