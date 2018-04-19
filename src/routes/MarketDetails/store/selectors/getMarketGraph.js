import { createSelector } from 'reselect'
import { normalizeScalarPoint, getOutcomeName } from 'utils/helpers'
import { OUTCOME_TYPES } from 'utils/constants'

import { getMarketTrades } from 'selectors/marketTrades'

const getFirstGraphPoint = (market) => {
  let firstPoint
  if (OUTCOME_TYPES.SCALAR === market.event.type) {
    firstPoint = {
      date: new Date(market.creationDate).valueOf(),
      scalarPoint: normalizeScalarPoint(['0.5', '0.5'], market),
    }
  } else if (OUTCOME_TYPES.CATEGORICAL === market.event.type) {
    firstPoint = {
      date: new Date(market.creationDate).valueOf(),
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

const getLastGraphPoint = trades => ({ ...trades[trades.length - 1], date: new Date().valueOf() })

const getMarketGraph = market =>
  createSelector(getMarketTrades(market.address), (trades) => {
    const firstPoint = getFirstGraphPoint(market)

    if (!trades.length) {
      return [firstPoint, firstPoint]
    }

    const graphPoints = trades.reverse().map(trade =>
      trade.marginalPrices.reduce(
        (prev, current, outcomeIndex) => {
          const toReturn = { ...prev }
          toReturn[getOutcomeName(market, outcomeIndex)] = current
          return toReturn
        },
        {
          date: new Date(trade.date).valueOf(),
          scalarPoint:
            OUTCOME_TYPES.SCALAR === market.event.type ? normalizeScalarPoint(trade.marginalPrices, market) : undefined,
        },
      ))
    const lastPoint = trades.length ? getLastGraphPoint(graphPoints) : { ...firstPoint, date: new Date().valueOf() }

    return [firstPoint, ...graphPoints, lastPoint]
  })

export default getMarketGraph
