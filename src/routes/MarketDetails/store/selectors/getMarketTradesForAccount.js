import { createSelector } from 'reselect'
import { getMarkets, enhanceAndSortTrades } from 'selectors/market'
import { eventMarketSelector, getTradesForAccount } from 'selectors/marketTrades'

const getMarketTradesForAccount = (marketAddress, accountAddress) =>
  createSelector(
    getMarkets,
    eventMarketSelector(marketAddress),
    getTradesForAccount(accountAddress),
    enhanceAndSortTrades,
  )

export default getMarketTradesForAccount
