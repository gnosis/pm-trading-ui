import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import { calcLMSRMarginalPrice } from 'api'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import TrendingOutcomeCategorical from './TrendingOutcomeCategorical'

import style from './outcomeCategorical.mod.scss'

const cx = cn.bind(style)

const OutcomeCategorical = ({ market, market: { outcomes }, opts = {} }) => {
  const {
    showOnlyTrendingOutcome, showDate, dateFormat, className,
  } = opts
  const tokenDistribution = outcomes.toArray().map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.outcomeTokensSold.toArray(),
      funding: market.funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed(5)
  })

  // show only trending outcome
  if (showOnlyTrendingOutcome && !market.resolved) {
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
      <TrendingOutcomeCategorical
        entryStyle={outcomeEntryStyle}
        outcome={outcomes[trendingOutcomeIndex]}
        percentage={trendingMarginalPricePercent}
        resolutionDate={resolutionDateFormatted}
      />
    )
  }

  // show all outcomes
  return (
    <div className={className}>
      {outcomes.map((outcome, outcomeIndex) => {
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
                  {outcomes[outcomeIndex]}
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

OutcomeCategorical.defaultProps = {
  market: {
    event: {},
    oracle: {},
    eventDescription: {},
  },
  opts: {
    className: '',
    showOnlyTrendingOutcome: false,
    showDate: false,
    dateFormat: '',
  },
}

export default OutcomeCategorical
