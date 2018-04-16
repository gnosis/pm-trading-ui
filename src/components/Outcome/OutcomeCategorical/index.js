import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import { calcLMSRMarginalPrice } from 'api'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import TrendingOutcomeCategorical from './TrendingOutcomeCategorical'

import style from './outcomeCategorical.mod.scss'

const cx = cn.bind(style)

const OutcomeCategorical = ({
  resolved,
  outcomeTokensSold,
  funding,
  resolution,
  outcomes,
  marginalPrices,
  opts = {},
}) => {
  const {
    showOnlyTrendingOutcome, showDate, dateFormat, className,
  } = opts
  const tokenDistribution = outcomes.map((outcome, outcomeIndex) => {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: outcomeTokensSold,
      funding,
      outcomeTokenIndex: outcomeIndex,
    })

    return marginalPrice.toFixed(5)
  })

  // show only trending outcome
  if (showOnlyTrendingOutcome && !resolved) {
    const tokenDistributionInt = tokenDistribution.map(outcome => parseInt(parseFloat(outcome) * 10000, 10))
    const trendingOutcomeIndex = tokenDistributionInt.indexOf(Math.max(...tokenDistributionInt))
    const outcomeEntryStyle = {
      backgroundColor: COLOR_SCHEME_DEFAULT[trendingOutcomeIndex],
    }
    const trendingMarginalPricePercent = Math.round(tokenDistribution[trendingOutcomeIndex] * 100).toFixed(0)
    const resolutionDateFormatted = showDate ? moment(resolution).format(dateFormat) : ''

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
  resolved: PropTypes.bool.isRequired,
  outcomeTokensSold: PropTypes.array.isRequired,
  resolution: PropTypes.string.isRequired,
  funding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  outcomes: PropTypes.arrayOf(PropTypes.string).isRequired,
  marginalPrices: PropTypes.arrayOf(PropTypes.string),
  opts: PropTypes.shape({
    className: PropTypes.string,
    showOnlyTrendingOutcome: PropTypes.bool,
    showDate: PropTypes.bool,
    dateFormat: PropTypes.string,
  }),
}

OutcomeCategorical.defaultProps = {
  marginalPrices: [],
  opts: {
    className: '',
    showOnlyTrendingOutcome: false,
    showDate: false,
    dateFormat: '',
  },
}

export default OutcomeCategorical
