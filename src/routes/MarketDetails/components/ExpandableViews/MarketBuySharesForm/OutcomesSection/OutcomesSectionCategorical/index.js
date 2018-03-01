import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import { Field } from 'redux-form'
import { calcLMSRMarginalPrice } from 'api'
import { OutcomeSelection } from 'components/Form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

const OutcomesSectionCategorical = (props) => {
  const {
    selectedBuyInvest,
    selectedOutcome,
    market: { funding, netOutcomeTokensSold, eventDescription: { outcomes } },
    valid: isInvestmentValid,
    outcomeTokenCount,
  } = props

  const marketTokenCounts = netOutcomeTokensSold.map(value => Decimal(value))
  let marginalPrices = marketTokenCounts.map((value, outcomeTokenIndex) =>
    calcLMSRMarginalPrice({
      netOutcomeTokensSold: marketTokenCounts,
      outcomeTokenIndex,
      funding,
    }))

  // Run the calculations only if the amount user wants to invest isvalid, by default values are set to current
  // Market's paramteters
  if (isInvestmentValid && selectedBuyInvest) {
    marketTokenCounts[selectedOutcome] = marketTokenCounts[selectedOutcome].add(outcomeTokenCount)
    marginalPrices = marketTokenCounts.map((value, outcomeTokenIndex) =>
      calcLMSRMarginalPrice({
        netOutcomeTokensSold: marketTokenCounts,
        outcomeTokenIndex,
        funding,
      }))
  }

  const categoricalOutcomes = outcomes.map((label, index) => ({
    index,
    label,
    color: COLOR_SCHEME_DEFAULT[index],
    probability: marginalPrices[index].mul(100),
  }))

  return (
    <div className="col-md-7">
      <div className="row">
        <div className="col-md-12">
          <h2 className="marketBuyHeading">Your Trade</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field
            component={OutcomeSelection}
            name="selectedOutcome"
            className="marketBuyOutcome"
            outcomes={categoricalOutcomes}
          />
        </div>
      </div>
    </div>
  )
}

export default OutcomesSectionCategorical
