import { List } from 'immutable'
import { createSelector } from 'reselect'
import { isMarketClosedOrResolved, isMarketEndingSoon, isNewMarket } from 'store/utils/marketStatus'
import { marketsSelector } from 'store/selectors/market'

import filterSelector from './filter'
import sorterSelector from './sorter'

export const marketListSelector = createSelector(
  marketsSelector,
  filterSelector,
  sorterSelector,
  (markets, filter, sorter) => List(markets.filter(filter).sort(sorter).values()),
)

export const marketCounterSelector = state => List(state.marketList.values())

export const newMarketsSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    const openMarkets = markets.toArray().filter(market => !isMarketClosedOrResolved(market))
    const newMarkets = openMarkets.filter(market => isNewMarket(market.creation))

    return newMarkets.length
  },
)

export const endingSoonMarketSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    const openMarkets = markets.toArray().filter(market => !isMarketClosedOrResolved(market))
    const endingSoonMarkets = openMarkets.filter(market => isMarketEndingSoon(market.resolution))
    return endingSoonMarkets.length
  },
)

export const openMarketSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    const openMarkets = markets.toArray().filter(market => !isMarketClosedOrResolved(market))
    return openMarkets.length
  },
)
