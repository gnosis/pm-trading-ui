import { List } from 'immutable'
import { createSelector } from 'reselect'
import { isMarketClosed, isMarketEndingSoon, isNewMarket } from 'store/utils/marketStatus'

import filterSelector from './filter'
import sorterSelector from './sorter'

export const marketListSelector = createSelector(
  state => state.marketList,
  filterSelector,
  sorterSelector,
  (markets, filter, sorter) => List(markets.filter(filter).sort(sorter).values()),
)

export const marketCounterSelector = state =>
  List(state.marketList)

export const newMarketsSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.stage, market.resolution, market.resolved))
    const newMarkets = openMarkets.filter(market => isNewMarket(market.creation))

    return newMarkets ? newMarkets.size : 0
  },
)

export const endingSoonMarketSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.stage, market.resolution, market.resolved))
    const endingSoonMarkets = openMarkets.filter(market => isMarketEndingSoon(market.resolution))
    return endingSoonMarkets ? endingSoonMarkets.size : 0
  },
)

export const openMarketSelector = createSelector(
  marketCounterSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.stage, market.resolution, market.resolved))
    return openMarkets ? openMarkets.size : 0
  },
)
