import { createSelector } from 'reselect'
import { marketsSelector } from 'store/selectors/market'
import { getTradesForAccount, enhanceAndSortTrades } from 'store/selectors/marketTrades'
import { hexWithPrefix } from 'utils/helpers'

export const eventMarketSelector = marketAddress => (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  if (!state.entities.markets[marketAddress]) {
    return {}
  }

  const market = state.entities.markets[marketAddress]
  const eventAddress = hexWithPrefix(market.event)

  return { [eventAddress]: market }
}

const getMarketTradesForAccount = (marketAddress, accountAddress) =>
  createSelector(
    marketsSelector,
    eventMarketSelector(marketAddress),
    getTradesForAccount(accountAddress),
    enhanceAndSortTrades,
  )

export default getMarketTradesForAccount
