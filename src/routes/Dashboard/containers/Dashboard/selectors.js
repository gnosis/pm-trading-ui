import moment from 'moment'
import { List } from 'immutable'
import { createSelector, createStructuredSelector } from 'reselect'

/**
 * How many markets to get from state to display in each list
 */
const MARKET_OVERVIEW_PREVIEW_NUM = 10

/**
 * Get markets from store that close soon, ordered by resolution date and only taking a maximum of MARKET_OVERVIEW_PREVIEW_NUM markets
 */
export const closingSoonMarkets = createSelector(
  state => state.marketList,
  markets => List(markets.filter(market => market.stage >= 1 && moment.utc().isBefore(moment(market.resolution).utc()))
    .sortBy(market => market.resolution)
    .take(MARKET_OVERVIEW_PREVIEW_NUM)
    .values()),
)

/**
 * Get markets from store that are newly created, ordered by creation date date and only taking a maximum of MARKET_OVERVIEW_PREVIEW_NUM markets
 */
export const newestMarkets = createSelector(
  state => state.marketList,
  markets => List(markets.sortBy(market => market.stage >= 1 && market.creation)
    .take(MARKET_OVERVIEW_PREVIEW_NUM)
    .values()),
)

export default createStructuredSelector({
  closingSoonMarkets,
  newestMarkets,
})
