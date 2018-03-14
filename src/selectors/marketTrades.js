import { createSelector } from 'reselect'
import { filter, mapValues } from 'lodash'
import { hexWithPrefix } from 'utils/helpers'
import moment from 'moment'

import { getMarkets, getMarketById } from 'selectors/market'

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

const tradesWithMarketsSelector = createSelector(
  getTrades,
  eventMarketsSelector,
  (trades, eventMarkets) => mapValues(trades, (trade) => {
    const market = eventMarkets[trade.outcomeToken.event]

    if (market) {
      return {
        ...trade,
        market: market.address,
      }
    }

    return trade
  }),
)

const getTradesForMarket = marketAddress => createSelector(
  tradesWithMarketsSelector,
  trades => filter(trades, trade => trade.market === marketAddress),
)

export const getTradesForAccount = accountAddress => createSelector(
  tradesWithMarketsSelector,
  (trades) => {
    const prefixedAccountAddress = hexWithPrefix(accountAddress)
    return filter(trades, trade => trade.owner === prefixedAccountAddress)
  },
)

export const enhanceAndSortTrades = (markets, eventMarkets, trades) => Object.keys(trades)
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
