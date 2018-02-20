import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import TrendingOutcome from './TrendingOutcome'
import { calcLMSRMarginalPrice } from 'api'

import style from './outcomeCategorical.scss'

const cx = cn.bind(style)

const OutcomeCategorical = ({ market, opts = {} }) => {
  const renderOutcomes = market.eventDescription.outcomes
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
      <TrendingOutcome
        entryStyle={outcomeEntryStyle}
        outcome={renderOutcomes[trendingOutcomeIndex]}
        percentage={trendingMarginalPricePercent}
        resolutionDate={resolutionDateFormatted}
      />
    )
  }

  // show all outcomes
  return (
    <div className={className}>
      {renderOutcomes.map((outcome, outcomeIndex) => {
        const outcomeBarStyle = {
          width: `${tokenDistribution[outcomeIndex] * 100}%`,
          backgroundColor: COLOR_SCHEME_DEFAULT[outcomeIndex],
        }
        const tokenDistributionPercent = `${Math.round(tokenDistribution[outcomeIndex] * 100).toFixed(0)}%`

        return (
          <div key={outcome} className={cx('outcome')}>
            <div className={cx('outcomeBar')}>
              <div className={cx('outcomeBarInner')} style={outcomeBarStyle}>
                <div className={cx('outcomeBarLabel')}>
                  {renderOutcomes[outcomeIndex]}
                  <div className={cx('outcomeBarValue')}>{tokenDistributionPercent}</div>
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
