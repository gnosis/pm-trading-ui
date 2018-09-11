import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DateAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={0} dy={16} fill="white" textAnchor="middle">
      {moment(payload.value).format('DD/MM/YYYY')}
    </text>
  </g>
)

DateAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.string,
}

DateAxisTick.defaultProps = {
  x: 0,
  y: 0,
  payload: '',
}

export default DateAxisTick
