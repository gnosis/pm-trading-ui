import React from 'react'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import CustomTooltip from 'components/CustomTooltip'

const ScalarGraph = (data, { eventDescription, lowerBound, upperBound }) => {
  const stacks = [`Current ${eventDescription.unit}`]
  const z = scaleOrdinal(schemeDark2)
  z.domain(stacks)

  return (
    <div className="marketGraph">
      <div className="container marketGraph__container">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 50,
              left: 50,
              bottom: 0,
            }}
          >
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

export default ScalarGraph
