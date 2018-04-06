import React from 'react'
import OutcomeCategorical from 'components/Outcome/OutcomeCategorical'
import OutcomeScalar from 'components/Outcome/OutcomeScalar'
import WinningOutcome from 'components/Outcome/WinningOutcome'
import { OUTCOME_TYPES } from 'utils/constants'
import PropTypes from 'prop-types'

const Outcome = ({
  resolved: showWinningOutcome,
  type,
  upperBound,
  lowerBound,
  unit,
  decimals,
  outcomeTokensSold,
  resolution,
  outcomes,
  marginalPrices,
  winningOutcome,
  funding,
  opts = { showOnlyTrendingOutcome: false },
}) => {
  let outcomeComponent = type === OUTCOME_TYPES.CATEGORICAL ? (
    <OutcomeCategorical
      opts={opts}
      resolved={showWinningOutcome}
      outcomeTokensSold={outcomeTokensSold}
      resolution={resolution}
      funding={funding}
      outcomes={outcomes}
      marginalPrices={marginalPrices}
      winningOutcome={winningOutcome}
    />
  ) : (
    <OutcomeScalar
      opts={opts}
      upperBound={upperBound}
      lowerBound={lowerBound}
      unit={unit}
      decimals={decimals}
      resolved={showWinningOutcome}
      outcomeTokensSold={outcomeTokensSold}
      resolution={resolution}
      funding={funding}
      marginalPrices={marginalPrices}
      winningOutcome={winningOutcome}
    />
  )

  if (showWinningOutcome) {
    outcomeComponent = (
      <WinningOutcome
        type={type}
        upperBound={upperBound}
        lowerBound={lowerBound}
        unit={unit}
        decimals={decimals}
        outcomeTokensSold={outcomeTokensSold}
        resolution={resolution}
        outcomes={outcomes}
        winningOutcome={winningOutcome}
      />
    )
  }

  return outcomeComponent
}

Outcome.propTypes = {
  resolved: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(Object.keys(OUTCOME_TYPES)).isRequired,
  upperBound: PropTypes.number,
  lowerBound: PropTypes.number,
  unit: PropTypes.string,
  decimals: PropTypes.number,
  outcomeTokensSold: PropTypes.array,
  resolution: PropTypes.string,
  funding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outcomes: PropTypes.arrayOf(PropTypes.string),
  marginalPrices: PropTypes.arrayOf(PropTypes.string),
  opts: PropTypes.shape({
    showOnlyTrendingOutcome: PropTypes.bool,
    showDate: PropTypes.bool,
    dateFormat: PropTypes.string,
    className: PropTypes.string,
  }),
}


export default Outcome
