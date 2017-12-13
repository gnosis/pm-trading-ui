import { createSelector } from 'reselect'

import { normalizeScalarPoint, getOutcomeName } from 'utils/helpers'
import { OUTCOME_TYPES } from 'utils/constants'

import { getMarketTrades } from './marketTrades'

const getFirstGraphPoint = (market) => {
  let firstPoint
  if (OUTCOME_TYPES.SCALAR === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: normalizeScalarPoint(['0.5', '0.5'], market),
    }
  } else if (OUTCOME_TYPES.CATEGORICAL === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: undefined,
      ...market.eventDescription.outcomes.reduce((prev, current) => {
        const toReturn = {
          ...prev,
        }
        toReturn[current] = 1 / market.eventDescription.outcomes.length
        return toReturn
      }, {}),
    }
  }
  return firstPoint
}

const getLastGraphPoint = trades => ({ ...trades[trades.length - 1], date: new Date().toISOString() })

export const getMarketGraph = market => createSelector(
  getMarketTrades(market.address),
  (trades) => {
    const firstPoint = getFirstGraphPoint(market)

    const graphPoints = trades.map(trade => trade.marginalPrices.reduce(
      (prev, current, outcomeIndex) => {
        const toReturn = { ...prev }
        toReturn[getOutcomeName(market, outcomeIndex)] = current
        return toReturn
      },
      {
        date: trade.date,
        scalarPoint:
          OUTCOME_TYPES.SCALAR === market.event.type ? normalizeScalarPoint(trade.marginalPrices, market) : undefined,
      },
    ))
    const lastPoint = trades.length ? getLastGraphPoint(graphPoints) : { ...firstPoint, date: new Date().toISOString() }

    return [firstPoint, ...graphPoints, lastPoint]
  },
)
