import React from 'react'
import PropTypes from 'prop-types'
import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import CategoricalGraph from './CategoricalGraph'
import ScalarGraph from './ScalarGraph'

const MarketGraph = ({
  data = [],
  market: {
    type,
    bounds: { lower, upper },
    description,
  },
}) => {
  if (data.length) {
    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return <CategoricalGraph data={data} />
    } else if (type === OUTCOME_TYPES.SCALAR) {
      return (
        <ScalarGraph data={data} eventDescription={description} lowerBound={lower} upperBound={upper} />
      )
    }
  }

  return null
}

MarketGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  market: marketShape,
}

MarketGraph.defaultProps = {
  data: [],
  market: {
    event: {},
    eventDescription: {},
  },
}

export default MarketGraph
