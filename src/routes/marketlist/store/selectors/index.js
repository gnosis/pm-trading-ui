import { List } from 'immutable'
import moment from 'moment'
import { createSelector } from 'reselect'
import { MARKET_STAGES } from 'store/models'

export const marketListSelector = state => List(state.marketList.values())

// TODO find a better place for this helper
const isMarketClosed = (stage, resolutionDate, resolved) => {
  const stageClosed = stage === MARKET_STAGES.MARKET_CLOSED
  const marketExpired = moment.utc(resolutionDate).isBefore(moment().utc())
  const marketResolved = resolved === true

  const marketClosed = stageClosed || marketExpired || marketResolved
  return marketClosed
}

const isMarketEndingSoon = (resolutionDate) => {
  const threeDays = moment().add(3, 'days').utc()

  return moment.utc(resolutionDate).isBefore(threeDays)
}

const isNewMarket = (creation) => {
  const threeDaysAgo = moment().subtract(3, 'days').utc()

  return threeDaysAgo.isBefore(creation)
}

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
    const endingSoonMarkets = openMarkets.filter(market => isMarketEndingSoon(market.resoution))
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
