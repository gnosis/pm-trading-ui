import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { OUTCOME_TYPES, COLOR_SCHEME_DEFAULT, RESOLUTION_TIME } from 'utils/constants'
import Decimal from 'decimal.js'

const DateAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={0} dy={16} fill="white" textAnchor="middle">
      {moment(payload).format('L')}
    </text>
  </g>
)

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
            <YAxis className="axis axis--y" tick={PercentAxisTick} tickCount={5} />
            <Tooltip className="tooltip" content={<CustomTooltip />} />
            <Legend />
            {stacks.map((key, keyIndex) => (
              <Line key={key} type="stepAfter" dataKey={key} stackId="1" fill={COLOR_SCHEME_DEFAULT[keyIndex]} stroke={COLOR_SCHEME_DEFAULT[keyIndex]} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const renderScalarGraph = (data, { eventDescription, lowerBound, upperBound }) => {
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
            <YAxis
              className="axis axis--y" domain={
              [
                Decimal(lowerBound).div(10 ** eventDescription.decimals).toDP(eventDescription.decimals).toNumber(),
                Decimal(upperBound).div(10 ** eventDescription.decimals).toDP(eventDescription.decimals).toNumber(),
              ]
            }
            />
            <CartesianGrid className="grid" vertical />
            <Tooltip className="tooltip" content={<CustomTooltip />} />
            <Line type="stepAfter" dataKey="scalarPoint" fill={COLOR_SCHEME_DEFAULT[0]} stroke={COLOR_SCHEME_DEFAULT[0]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const MarketGraph = ({ data = [], market: { event: { type, lowerBound, upperBound }, eventDescription } }) => {
  if (data.length) {
    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return renderCategoricalGraph(data)
    } else if (type === OUTCOME_TYPES.SCALAR) {
      return renderScalarGraph(data, { eventDescription, lowerBound, upperBound })
    }
  }
  return <div />
}

const CustomTooltip = ({ payload = [], label, active, separator, itemStyle, itemSorter, labelStyle, wrapperStyle }) => {
  const isNumOrStr = value => (_.isNumber(value) && !_.isNaN(value)) || _.isString(value)

  const renderContent = () => {
    if (payload && payload.length) {
      const listStyle = { padding: 0, margin: 0 }

      const items = payload.filter(entry => !_.isNil(entry.value))
      .sort(itemSorter)
      .map((entry, i) => {
        const finalItemStyle = {
          display: 'block',
          paddingTop: 4,
          paddingBottom: 4,
          color: entry.color || '#000',
          ...itemStyle,
        }
        const hasName = isNumOrStr(entry.name)

        return (
          <li className="recharts-tooltip-item" key={`tooltip-item-${i}`} style={finalItemStyle}>
            {hasName ? <span className="recharts-tooltip-item-name">{entry.name}</span> : null}
            {
              hasName ?
                <span className="recharts-tooltip-item-separator">{separator}</span> :
                null
            }
            <span className="recharts-tooltip-item-value">
              {Decimal(entry.value).mul(100).toDP(4, 1).toString()}
            </span>
            <span className="recharts-tooltip-item-unit">{entry.unit || '%'}</span>
          </li>
        )
      })

      return <ul className="recharts-tooltip-item-list" style={listStyle}>{items}</ul>
    }

    return null
  }

  const finalStyle = {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap',
    ...wrapperStyle,
  }
  const finalLabelStyle = {
    margin: 0,
    ...labelStyle,
  }
  const hasLabel = isNumOrStr(label)
  let finalLabel = hasLabel ? label : ''

  if (hasLabel) {
    finalLabel = moment.utc(label).local().format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
  }
  if (active) {
    return (
      <div className="recharts-default-tooltip" style={finalStyle}>
        <p className="recharts-tooltip-label" style={finalLabelStyle}>{finalLabel}</p>
        {renderContent()}
      </div>
    )
  }
  return (<div />)
}

DateAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.string,
}

PercentAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.number,
  }),
}

MarketGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  market: PropTypes.shape(
    {
      event: PropTypes.shape(
        {
          type: PropTypes.string,
          lowerBound: PropTypes.string,
          upperBound: PropTypes.string,
        },
      ),
      eventDescription: PropTypes.shape(
        {
          resolutionDate: PropTypes.string,
          outcomes: PropTypes.arrayOf(PropTypes.string),
          decimals: PropTypes.number,
          unit: PropTypes.string,
          title: PropTypes.string,
        },
      ),
    },
  ),
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string,
  active: PropTypes.bool,
  separator: PropTypes.string,
  itemStyle: PropTypes.object,
  itemSorter: PropTypes.func,
  labelStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
}

export default MarketGraph
