import React from 'react'
import OutcomeCategorical from 'components/OutcomeCategorical'
import OutcomeScalar from 'components/OutcomeScalar'
import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import PropTypes from 'prop-types'

const Outcome = ({ market, opts = {} }) => {
  const { event: { type: eventType } } = market

  return (eventType === OUTCOME_TYPES.CATEGORICAL ? <OutcomeCategorical market={market} opts={opts} />
    : <OutcomeScalar market={market} />)
}


Outcome.propTypes = {
  market: marketShape,
  opts: PropTypes.shape({
    showOnlyTrendingOutcome: PropTypes.bool,
  }),
}

export default Outcome
