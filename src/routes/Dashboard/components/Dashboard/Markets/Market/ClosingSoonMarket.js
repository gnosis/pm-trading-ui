import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { marketRecordShape } from 'utils/shapes'
import classname from 'classnames/bind'
import Outcome from 'components/Outcome'
import { OUTCOME_TYPES } from 'utils/constants'

import style from './Market.mod.scss'

const cx = classname.bind(style)

const ClosingSoonMarket = ({ market, viewMarket }) => {
  const durationToResolution = moment.duration(moment.utc(market.resolution).diff(moment.utc()))
  let timeUntilResolution = durationToResolution.humanize()

  if (durationToResolution.asMonths() > 1) {
    timeUntilResolution = '> 30 d'
  }

  const outcomeOptions = { showOnlyTrendingOutcome: true }
  const outcomes = market.outcomes ? market.outcomes.map(outcome => outcome.name).toArray() : []
  const bounds = market.bounds ? {
    upperBound: market.bounds.upper,
    lowerBound: market.bounds.lower,
    unit: market.bounds.unit,
    decimals: market.bounds.decimals,
  } : {}
  const winningOutcome = market.type === OUTCOME_TYPES.CATEGORICAL ? market.outcomes.keyOf(market.winningOutcome) : market.winningOutcome

  return (
    <button type="button" className={cx('market', 'closingSoon')} onClick={() => viewMarket(market.address)}>
      <div className={cx('timeUntilResolution')}>
        <span className={cx('value')}>{timeUntilResolution}</span>
      </div>
      <div className={cx('description')}>
        <div className={cx('title')}>{market.title}</div>
        <Outcome
          resolved={market.resolved}
          type={market.type}
          outcomeTokensSold={market.outcomeTokensSold.toArray()}
          resolution={market.resolution}
          funding={market.funding}
          outcomes={outcomes}
          winningOutcome={winningOutcome}
          {...bounds}
          opts={outcomeOptions}
        />
      </div>
    </button>
  )
}

ClosingSoonMarket.propTypes = {
  viewMarket: PropTypes.func.isRequired,
  market: marketRecordShape.isRequired,
}

export default ClosingSoonMarket

