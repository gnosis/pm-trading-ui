import React from 'react'
import PropTypes from 'prop-types'
import { marketRecordShape } from 'utils/shapes'
import classname from 'classnames/bind'
import Outcome from 'components/Outcome'
import { OUTCOME_TYPES } from 'utils/constants'

import style from './Market.mod.scss'

const cx = classname.bind(style)

const NewMarket = ({ market, viewMarket }) => {
  const outcomeOptions = { showOnlyTrendingOutcome: true, showDate: true, dateFormat: 'D MMMM Y' }
  const outcomes = market.outcomes ? market.outcomes.map(outcome => outcome.name).toArray() : []
  const bounds = market.bounds ? {
    upperBound: market.bounds.upper,
    lowerBound: market.bounds.lower,
    unit: market.bounds.unit,
    decimals: market.bounds.decimals,
  } : {}
  const winningOutcome = market.type === OUTCOME_TYPES.CATEGORICAL ? market.outcomes.keyOf(market.winningOutcome) : market.winningOutcome
  console.log(market.outcomeTokensSold.toArray(), market.funding)
  return (
    <button type="button" className={cx('market', 'newMarket')} onClick={() => viewMarket(market.address)}>
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
    </button>
  )
}

NewMarket.propTypes = {
  viewMarket: PropTypes.func.isRequired,
  market: marketRecordShape.isRequired,
}

export default NewMarket

