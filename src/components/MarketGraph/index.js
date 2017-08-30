import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { OUTCOME_TYPES, COLOR_SCHEME_DEFAULT } from 'utils/constants'

const DateAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={0} dy={16} fill="white" textAnchor="middle">{moment(payload).format('L')}</text>
  </g>
)

DateAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.string,
}

const PercentAxisTick = ({ x, y, payload: { value } }) => (
  <g transform={`translate(${x}, ${y})`}>
    {(value === 0 || value === 1) &&
    <text x={0} y={0} dy={5} textAnchor="end" fill="white">{(value * 100).toFixed(0)}%</text>
      }
  </g>
  )

const renderCategoricalGraph = (data) => {
  const stacks = Object.keys(data[0]).slice(2)
  const z = scaleOrdinal(schemeDark2)
  z.domain(stacks)
  return (
    <div className="marketGraph">
      <div className="container marketGraph__container">
        <ResponsiveContainer>
          <AreaChart type="curveStepAfter" data={data} margin={{ top: 10, right: 50, left: 50, bottom: 0 }}>
            <defs>
              {stacks.map((key, keyIndex) => (
                <linearGradient key={key} id={`gradient_${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={z(keyIndex)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={z(keyIndex)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis className="axis axis--x" dataKey="date" minTickGap={150} tick={DateAxisTick} />
            <YAxis className="axis axis--y" tick={PercentAxisTick} tickCount={5} />
            <CartesianGrid className="grid" vertical />
            <Tooltip className="tooltip" />
            <Legend />
            {stacks.map((key, keyIndex) => (
              <Area className="area" key={key} type="stepAfter" dataKey={key} stackId="1" fill={COLOR_SCHEME_DEFAULT[keyIndex]} stroke={COLOR_SCHEME_DEFAULT[keyIndex]} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const renderScalarGraph = (data, eventDescription) => {
  const stacks = [`Current ${eventDescription.unit}`]
  const z = scaleOrdinal(schemeDark2)
  z.domain(stacks)

  return (
    <div className="marketGraph">
      <div className="container marketGraph__container">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 50, left: 50, bottom: 0 }}>
            <defs>
              {stacks.map((key, keyIndex) => (
                <linearGradient key={key} id={`gradient_${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={z(keyIndex)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={z(keyIndex)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis className="axis axis--x" dataKey="date" minTickGap={150} tick={DateAxisTick} />
            <YAxis className="axis axis--y" />
            <CartesianGrid className="grid" vertical />
            <Tooltip className="tooltip" />
            <Legend />
            <Line type="stepAfter" dataKey="scalarPoint" fill={COLOR_SCHEME_DEFAULT[0]} stroke={COLOR_SCHEME_DEFAULT[0]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

PercentAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.number,
  }),
}

const MarketGraph = ({ data = [], type, eventDescription }) => {
  if (data.length) {
    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return renderCategoricalGraph(data)
    } else if (type === OUTCOME_TYPES.SCALAR) {
      return renderScalarGraph(data, eventDescription)
    }
  }
  return <div />
}

MarketGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string.isRequired,
  eventDescription: PropTypes.shape(
    {
      resolutionDate: PropTypes.string,
      outcomes: PropTypes.arrayOf(PropTypes.string),
      decimals: PropTypes.number,
      unit: PropTypes.string,
      title: PropTypes.string,
    },
  ),
}

export default MarketGraph
