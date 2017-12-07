import React from 'react'
import PropTypes from 'prop-types'
import { calcLMSRMarginalPrice } from 'api'
import { OUTCOME_TYPES } from 'utils/constants'
import { eventDescriptionShape } from '../../utils/shapes'

const WinningOutcome = ({
  eventDescription: { outcomes },
  oracle: { outcome: winningOutcome },
  type,
  funding,
  netOutcomeTokensSold,
}) => {
  let outcomeText

  if (type === OUTCOME_TYPES.CATEGORICAL) {
    const tokenDistribution = outcomes.map((outcome, outcomeIndex) => {
      const marginalPrice = calcLMSRMarginalPrice({
        netOutcomeTokensSold,
        funding,
        outcomeTokenIndex: outcomeIndex,
      })

      return marginalPrice.toFixed()
    })

    const tokenDistributionPercent = `${Math.round(tokenDistribution[winningOutcome] * 100).toFixed(0)}%`
    outcomeText = `${outcomes[winningOutcome]} (${tokenDistributionPercent})`
  }

  return (
    <div className="outcome__winning">
      <div className="outcome__winning--container">
        <div className="outcome__winning--icon" />
        <span className="outcome__winning--label">
          Winning<br />outcome
        </span>
        <div className="outcome__winning--box">{outcomeText}</div>
      </div>
    </div>
  )
}

WinningOutcome.propTypes = {
  eventDescription: eventDescriptionShape,
  outcomes: PropTypes.array,
  type: PropTypes.string,
  funding: PropTypes.string,
  oracle: PropTypes.object,
  outcome: PropTypes.string,
  type: PropTypes.string,
  netOutcomeTokensSold: PropTypes.string,
}

export default WinningOutcome
