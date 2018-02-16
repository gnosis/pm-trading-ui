import moment from 'moment'
import { createSelector } from 'reselect'
import { MARKET_STAGES } from '../models/market'

export const marketSelector = state => state.marketList

// TODO find a better place for this helper
const isMarketClosed = (stage, resolutionDate) =>
  stage === MARKET_STAGES.MARKET_CLOSED || moment.utc(resolutionDate).isBefore(moment().utc())

export const openMarketSelector = createSelector(
  marketSelector,
  (markets) => {
    if (!markets) {
      return 0
    }

    const openMarkets = markets.filter(market => !isMarketClosed(market.state, market.date))
    return openMarkets ? openMarkets.size : 0
  },
)

/*
  open markets selectors
  ending soon markets
  new markets

  list of markets
*/
