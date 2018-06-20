import { createSelector } from 'reselect'
import { isMarketFunded } from 'store/utils/marketStatus'

export const marketsSelector = createSelector(
  state => state.marketList,
  marketList => marketList.filter(market => isMarketFunded(market.stage)),
)

export const getMarketById = state => marketAddress => state.marketList.get(marketAddress, {})

export * from './old'
