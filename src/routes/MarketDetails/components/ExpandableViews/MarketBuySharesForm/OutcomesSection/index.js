import React from 'react'
import { marketShape } from 'utils/shapes'
import { OUTCOME_TYPES } from 'utils/constants'
import OutcomesSectionCategorical from './OutcomesSectionCategorical'

const BuySharesOutcomeSection = (props) => {
  const { market: { event: { type } } } = props
  if (type === OUTCOME_TYPES.CATEGORICAL) {
    return <OutcomesSectionCategorical {...props} />
  }

  if (type === OUTCOME_TYPES.SCALAR) {
    return <div />
  }

  return <div />
}

BuySharesOutcomeSection.propTypes = {
  market: marketShape,
}

BuySharesOutcomeSection.defaultProps = {
  market: {
    event: {},
  },
}

export default BuySharesOutcomeSection
