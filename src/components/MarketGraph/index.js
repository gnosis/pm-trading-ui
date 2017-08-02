import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

PercentAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.number,
  }),
}

const MarketGraph = ({ data }) => {
  const stacks = Object.keys(data[0]).slice(1)
  const z = scaleOrdinal(schemeDark2)
  z.domain(stacks)

  return (
    <div className="marketGraph">
      <div className="container marketGraph__container">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 50, left: 50, bottom: 0 }}>
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
            {stacks.map((key, keyIndex) => (
              <Area className="area" key={key} type="monotone" dataKey={key} stackId="1" fill={`url(#gradient_${key})`} stroke={z(keyIndex)} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

MarketGraph.propTypes = {
  data: PropTypes.object,
}

export default MarketGraph
