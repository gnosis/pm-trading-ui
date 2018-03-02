import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Decimal from 'decimal.js'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { eventDescriptionShape } from 'utils/shapes'
import CustomTooltip from '../CustomTooltip'
import DateAxisTick from '../DateAxisTick'
import style from '../MarketGraph.mod.scss'

const cx = cn.bind(style)

const lineChartMargins = {
  top: 10,
  right: 50,
  left: 50,
  bottom: 0,
}

const ScalarGraph = ({
  data, eventDescription, lowerBound, upperBound,
}) => {
  const stacks = [`Current ${eventDescription.unit}`]
  const z = scaleOrdinal(schemeDark2)
  z.domain(stacks)

  return (
    <div className={cx('marketGraph')}>
      <div className={cx('marketGraphContainer')}>
        <ResponsiveContainer>
          <LineChart data={data} margin={lineChartMargins}>
            <defs>
              {stacks.map((key, keyIndex) => (
                <linearGradient key={key} id={`gradient_${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={z(keyIndex)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={z(keyIndex)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              className="axis axis--x"
              dataKey="date"
              scale="auto"
              tick={DateAxisTick}
              domain={[data[0].date, new Date().valueOf()]}
            />
            <YAxis
              className="axis axis--y"
              unit={eventDescription.unit}
              domain={[
                Decimal(lowerBound)
                  .div(10 ** eventDescription.decimals)
                  .toDP(eventDescription.decimals)
                  .toNumber(),
                Decimal(upperBound)
                  .div(10 ** eventDescription.decimals)
                  .toDP(eventDescription.decimals)
                  .toNumber(),
              ]}
            />
            <CartesianGrid className="grid" vertical />
            <Tooltip className="tooltip" content={<CustomTooltip isScalar unit={eventDescription.unit} />} />
            <Line
              type="stepAfter"
              dataKey="scalarPoint"
              fill={COLOR_SCHEME_DEFAULT[2]}
              stroke={COLOR_SCHEME_DEFAULT[2]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

ScalarGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  eventDescription: eventDescriptionShape,
  lowerBound: PropTypes.string,
  upperBound: PropTypes.string,
}

ScalarGraph.defaultProps = {
  data: [],
  eventDescription: {},
  lowerBound: '',
  upperBound: '',
}

export default ScalarGraph
