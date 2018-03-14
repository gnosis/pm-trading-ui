import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import LoadingIndicator from 'components/LoadingIndicator'
import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import CategoricalGraph from './CategoricalGraph'
import ScalarGraph from './ScalarGraph'
import style from './MarketGraph.mod.scss'

const cx = cn.bind(style)

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
      <LoadingIndicator className={cx('marketGraphSpinner')} />
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
