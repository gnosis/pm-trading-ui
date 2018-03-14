import React from 'react'
import PropTypes from 'prop-types'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import CategoricalGraph from './CategoricalGraph'
import ScalarGraph from './ScalarGraph'

const MarketGraph = ({ data = [], market: { event: { type, lowerBound, upperBound }, eventDescription } }) => {
  if (data.length) {
    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return <CategoricalGraph data={data} />
    } else if (type === OUTCOME_TYPES.SCALAR) {
      return (
        <ScalarGraph data={data} eventDescription={eventDescription} lowerBound={lowerBound} upperBound={upperBound} />
      )
    }
  }

  return (
    <div className="container">
      <IndefiniteSpinner width={60} height={60} />
    </div>
  )
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
