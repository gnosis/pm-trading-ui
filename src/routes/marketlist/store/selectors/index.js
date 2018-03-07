import { List } from 'immutable'
import { createSelector } from 'reselect'
import { isMarketFunded, isMarketClosed, isMarketEndingSoon, isNewMarket } from 'store/utils/marketStatus'

const marketSort = (marketA, marketB) => {
  const isAClosed = isMarketClosed(marketA.stage, marketA.resolution, marketA.resolved)
  const isBClosed = isMarketClosed(marketB.stage, marketB.resolution, marketB.resolved)

  if (isAClosed && !isBClosed) {
    return 1
  }

  if (!isAClosed && isBClosed) {
    return -1
  }

  if (marketA.resolution > marketB.resolution) {
    return -1
  }

  if (marketB.resolution > marketA.resolution) {
    return 1
  }

  return 0
}

const marketFilter = market => isMarketFunded(market.stage)

export const marketListSelector = state =>
  List(state.marketList
    .filter(marketFilter)
    .sort(marketSort)
    .values())

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
