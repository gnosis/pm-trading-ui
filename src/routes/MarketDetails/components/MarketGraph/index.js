import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import CategoricalGraph from './CategoricalGraph'
import LoadingIndicator from 'components/LoadingIndicator'
import { OUTCOME_TYPES, COLOR_SCHEME_DEFAULT } from 'utils/constants'
import Decimal from 'decimal.js'
import style from './MarketGraph.scss'

const cx = cn.bind(style)

export const DateAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={0} dy={16} fill="white" textAnchor="middle">
      {moment(payload.value).format('L')}
    </text>
  </g>
)

const MarketGraph = ({ data = [], market: { event: { type, lowerBound, upperBound }, eventDescription } }) => {
  if (data.length) {
    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return <CategoricalGraph data={data} />
    } else if (type === OUTCOME_TYPES.SCALAR) {
      return renderScalarGraph(data, { eventDescription, lowerBound, upperBound })
    }
  }
  return (
    <div className="container">
      <LoadingIndicator className={cx('marketGraphSpinner')} />
    </div>
  )
}

DateAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.string,
}

MarketGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  market: PropTypes.shape({
    event: PropTypes.shape({
      type: PropTypes.string,
      lowerBound: PropTypes.string,
      upperBound: PropTypes.string,
    }),
    eventDescription: PropTypes.shape({
      resolutionDate: PropTypes.string,
      outcomes: PropTypes.arrayOf(PropTypes.string),
      decimals: PropTypes.number,
      unit: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}

export default MarketGraph
