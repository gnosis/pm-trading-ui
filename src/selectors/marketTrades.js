import { createSelector } from 'reselect'
import { filter } from 'lodash'
import { hexWithPrefix } from 'utils/helpers'
import moment from 'moment'

import { getMarkets, getMarketById } from './market'

export const getTrades = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.marketTrades) {
    return {}
  }

  return state.entities.marketTrades
}
const eventMarketsSelector = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  const { markets } = state.entities
  const eventMarkets = {}

  const marketSelector = getMarketById(state)

  Object.keys(markets).forEach((marketAddress) => {
    eventMarkets[markets[marketAddress].event] = marketSelector(marketAddress)
  })

  return eventMarkets
}

const eventMarketSelector = marketAddress => (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  if (!state.entities.markets[marketAddress]) {
    return {}
  }

  const market = getMarketById(state)(marketAddress)
  const eventAddress = hexWithPrefix(market.event.address)

  return { [eventAddress]: market }
}

const enhanceAndSortTrades = (markets, eventMarkets, trades) => Object.keys(trades)
  .map((tradeId) => {
    const eventAddress = trades[tradeId].outcomeToken.event
    const market = eventMarkets[eventAddress]

    return {
      id: tradeId,
      ...trades[tradeId],
      market,
    }
  })
  .filter(trade => trade.market && Object.keys(trade.market).length)
  .sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1))

const getTradesForMarket = marketAddress => (state) => {
  const trades = getTrades(state)

  return filter(trades, trade => trade.market === marketAddress)
}

const getTradesForAccount = accountAddress => (state) => {
  const trades = getTrades(state)

  const prefixedAccountAddress = hexWithPrefix(accountAddress)
  return filter(trades, trade => trade.owner === prefixedAccountAddress)
}

export const getMarketTrades = marketAddress => createSelector(
  getMarkets,
  eventMarketSelector(marketAddress),
  getTradesForMarket(marketAddress),
  enhanceAndSortTrades,
)

export const getAccountTrades = accountAddress => createSelector(
  getMarkets,
  eventMarketsSelector,
  getTradesForAccount(accountAddress),
  enhanceAndSortTrades,
)
