import moment from 'moment'
import Decimal from 'decimal.js'
import { List } from 'immutable'
import { createSelector, createStructuredSelector } from 'reselect'
import { isMarketClosed } from 'store/utils/marketStatus'
import { checkWalletConnection, getCurrentAccount } from 'integrations/store/selectors'

import { marketSelector } from 'store/selectors/market'
import { getCollateralToken } from 'store/selectors/blockchain'
import { shareSelector, tradeSelector } from '../../store/selectors'
import { calculateProfit } from './utils'

/**
 * How many markets to get from state to display in each list
 */
const MARKET_OVERVIEW_PREVIEW_NUM = 5

export const dashboardMarketsSelector = createSelector(
  marketSelector,
  markets => markets.filter(market => !isMarketClosed(market.stage, market.resolution, market.resolved)),
)

/**
 * Get markets from store that close soon, ordered by resolution date and only taking a maximum of MARKET_OVERVIEW_PREVIEW_NUM markets
 */
export const closingSoonMarketsSelector = createSelector(
  dashboardMarketsSelector,
  markets => List(markets.filter(market => market.stage >= 1 && moment.utc().isBefore(moment(market.resolution).utc()))
    .sortBy(market => market.resolution)
    .take(MARKET_OVERVIEW_PREVIEW_NUM)
    .values()),
)

/**
 * Get markets from store that are newly created, ordered by creation date date and only taking a maximum of MARKET_OVERVIEW_PREVIEW_NUM markets
 */
export const newestMarketsSelector = createSelector(
  dashboardMarketsSelector,
  markets => List(markets.sortBy(market => market.stage >= 1 && market.creation)
    .take(MARKET_OVERVIEW_PREVIEW_NUM)
    .values()),
)

export const dashboardProfitsSelector = createSelector(
  getCurrentAccount,
  shareSelector,
  (account, accountShares) => {
    const minProfit = Decimal(0)

    if (!account) {
      return minProfit
    }

    const shares = accountShares
    return shares.size ? shares.reduce((assets, share) => assets.add(calculateProfit(share)), minProfit) : minProfit
  },
)

export default createStructuredSelector({
  closingSoonMarkets: closingSoonMarketsSelector,
  newestMarkets: newestMarketsSelector,
  myShares: shareSelector,
  myTrades: tradeSelector,
  currentAccount: getCurrentAccount,
  hasWallet: checkWalletConnection,
  collateralToken: getCollateralToken,
  predictedProfits: dashboardProfitsSelector,
})
