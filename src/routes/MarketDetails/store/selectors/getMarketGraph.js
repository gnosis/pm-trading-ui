import { createSelector } from 'reselect'
import moment from 'moment'
import { normalizeScalarPoint, getOutcomeName, normalizeHex } from 'utils/helpers'
import { OUTCOME_TYPES } from 'utils/constants'
import tradeSelector from 'store/selectors/account/trades'

const getFirstGraphPoint = (market) => {
  let firstPoint
  if (OUTCOME_TYPES.SCALAR === market.type) {
    firstPoint = {
      date: new Date(market.creation).valueOf(),
      scalarPoint: normalizeScalarPoint(['0.5', '0.5'], market),
    }
  } else if (OUTCOME_TYPES.CATEGORICAL === market.type) {
    firstPoint = {
      date: new Date(market.creation).valueOf(),
      scalarPoint: undefined,
      ...market.outcomes.reduce((prev, current) => {
        const toReturn = {
          ...prev,
        }
        toReturn[current.name] = 1 / market.outcomes.size
        return toReturn
      }, {}),
    }
  }
  return firstPoint
}

const getMarketGraph = market => createSelector(tradeSelector, (trades) => {
  const filteredTrades = trades.filter(
    trade => normalizeHex(trade.eventAddress) === normalizeHex(market.eventAddress),
  )
  const firstPoint = getFirstGraphPoint(market)

  if (filteredTrades.isEmpty()) {
    return [firstPoint, firstPoint]
  }

  const graphPoints = filteredTrades.reverse().map(trade => trade.marginalPrices.reduce(
    (prev, current, outcomeIndex) => {
      const toReturn = { ...prev }
      toReturn[getOutcomeName(market, outcomeIndex)] = current
      return toReturn
    },
    {
      date: new Date(trade.date).valueOf(),
      scalarPoint:
            OUTCOME_TYPES.SCALAR === market.type ? normalizeScalarPoint(trade.marginalPrices, market) : undefined,
    },
  ))

  const marketGraphTrades = [firstPoint, ...graphPoints]

  if (moment.utc().isBefore(moment.utc(market.resolution))) {
    marketGraphTrades.push({ ...graphPoints.get(graphPoints.size - 1), date: new Date().valueOf() })
  }

  return marketGraphTrades
})

export default getMarketGraph
