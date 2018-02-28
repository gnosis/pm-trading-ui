import React from 'react'
import { OUTCOME_TYPES } from 'utils/contants'

const BuySharesOutcomeSection = ({ market: { event: { type } } }) => {
  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    return this.renderCategorical()
  }

  if (event.type === OUTCOME_TYPES.SCALAR) {
    return this.renderScalar()
  }

  return (
    <div className="col-md-6">
      <span>Invalid Outcomes...</span>
    </div>
  )
}

export default BuySharesOutcomeSection
