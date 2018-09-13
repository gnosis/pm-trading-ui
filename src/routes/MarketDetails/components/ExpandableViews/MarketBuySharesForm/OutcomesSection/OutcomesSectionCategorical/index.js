import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import { Field } from 'redux-form'
import { marketShape } from 'utils/shapes'
import { calcLMSRMarginalPrice } from 'api'
import { OutcomeSelection, MandatoryHint } from 'components/Form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

const OutcomesSectionCategorical = (props) => {
  const {
    selectedOutcome,
    market: { funding, outcomeTokensSold, outcomes },
    outcomeTokenCount,
    valid,
  } = props

  const canRunSimulation = valid && selectedOutcome
  const marketTokenCounts = outcomeTokensSold.toArray().map(value => Decimal(value))
  let marginalPrices = marketTokenCounts.map((value, outcomeTokenIndex) => calcLMSRMarginalPrice({
    netOutcomeTokensSold: marketTokenCounts,
    outcomeTokenIndex,
    funding,
  }))

  // Run the simulation only if the amount user wants to invest is valid, by default values are set to current
  // Market's paramteters
  if (canRunSimulation) {
    marketTokenCounts[selectedOutcome] = marketTokenCounts[selectedOutcome].add(outcomeTokenCount)
    marginalPrices = marketTokenCounts.map((value, outcomeTokenIndex) => calcLMSRMarginalPrice({
      netOutcomeTokensSold: marketTokenCounts,
      outcomeTokenIndex,
      funding,
    }))
  }

  const categoricalOutcomes = outcomes.toArray().map((outcome, index) => ({
    index,
    label: outcome.name,
    color: COLOR_SCHEME_DEFAULT[index],
    probability: marginalPrices[index].mul(100),
  }))

  return (
    <div className="col-md-7">
      <div className="row">
        <div className="col-md-12">
          <h2>
            Your Trade
            <MandatoryHint />
          </h2>
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

OutcomesSectionCategorical.propTypes = {
  market: marketShape.isRequired,
  selectedOutcome: PropTypes.string,
  valid: PropTypes.bool,
  outcomeTokenCount: PropTypes.oneOfType([PropTypes.instanceOf(Decimal), PropTypes.number]).isRequired,
}

OutcomesSectionCategorical.defaultProps = {
  valid: false,
  selectedOutcome: undefined,
}

export default OutcomesSectionCategorical
