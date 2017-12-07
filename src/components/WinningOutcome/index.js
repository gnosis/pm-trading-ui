import React from 'react'
import PropTypes from 'prop-types'
import { calcLMSRMarginalPrice } from 'api'
import { OUTCOME_TYPES } from 'utils/constants'
import Decimal from 'decimal.js'
import { eventDescriptionShape, marketShape } from '../../utils/shapes'
import './WinningOutcome.less'

const WinningOutcome = ({
  market: {
    eventDescription: { outcomes, unit, decimals },
    oracle: { outcome: winningOutcome },
    event: { type },
    funding,
    netOutcomeTokensSold,
  },
}) => {
  let outcomeText
  if (type === OUTCOME_TYPES.CATEGORICAL) {
    const tokenDistribution = outcomes.map((outcome, outcomeIndex) => {
      const marginalPrice = calcLMSRMarginalPrice({
        netOutcomeTokensSold,
        funding,
        outcomeTokenIndex: outcomeIndex,
      })

      return marginalPrice.isNaN ? 0 : marginalPrice.toFixed()
    })
    console.log(tokenDistribution)
    const tokenDistributionPercent = `${Math.round(tokenDistribution[winningOutcome] * 100).toFixed(0)}%`
    outcomeText = `${outcomes[winningOutcome]} (${tokenDistributionPercent})`
  } else if (type === OUTCOME_TYPES.SCALAR) {
    const outcomeValue = Decimal(winningOutcome)
      .div(10 ** decimals)
      .toString()
    outcomeText = (
      <span>
        {outcomeValue} <span className="outcome__winning--unit">{unit}</span>
      </span>
    )
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
  market: marketShape,
  unit: PropTypes.string,
  decimals: PropTypes.string,
}

export default WinningOutcome
