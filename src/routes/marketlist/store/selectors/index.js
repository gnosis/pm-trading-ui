import { List } from 'immutable'
import { createSelector } from 'reselect'
import { isMarketClosed, isMarketEndingSoon, isNewMarket } from './marketStatus'

export const marketListSelector = state => List(state.marketList.values())

export const newMarketsSelector = createSelector(
  marketListSelector,
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
  marketListSelector,
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
  marketListSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.stage, market.resolution, market.resolved))
    return openMarkets ? openMarkets.size : 0
  },
)
