import moment from 'moment'
import { createSelector } from 'reselect'
import { MARKET_STAGES } from '../models/market'

export const marketSelector = state => state.marketList

// TODO find a better place for this helper
const isMarketClosed = (stage, resolutionDate) =>
  stage === MARKET_STAGES.MARKET_CLOSED || moment.utc(resolutionDate).isBefore(moment().utc())

const isMarketEndingSoon = (stage, resolutionDate) => {
  const threeDays = moment().add(3, 'D').utc()
  const marketNotClosed = stage !== MARKET_STAGES.MARKET_CLOSED
  const lessThanThreeDays = moment.utc(resolutionDate).isBefore(threeDays)

  return marketNotClosed && lessThanThreeDays
}

export const endingSoonMarketSelector = createSelector(
  marketSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const endingSoonMarkets = markets.filter(market => isMarketEndingSoon(market.stage, market.date))
    return endingSoonMarkets ? endingSoonMarkets.size : 0
  },
)

export const openMarketSelector = createSelector(
  marketSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.stage, market.date))
    return openMarkets ? openMarkets.size : 0
  },
)
