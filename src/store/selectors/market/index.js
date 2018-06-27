import { createSelector } from 'reselect'
import { isMarketFunded } from 'store/utils/marketStatus'

export const marketSelector = createSelector(
  state => state.marketList,
  marketList => marketList.filter(market => isMarketFunded(market.stage)),
)

export * from './old'
