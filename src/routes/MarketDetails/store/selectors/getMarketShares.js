import { createSelector } from 'reselect'
import { getEvents } from 'store/selectors/event'
import { getOracles } from 'store/selectors/oracle'
import { getEventDescriptions } from 'store/selectors/eventDescription'
import { eventSharesSelector, enhanceShares } from 'store/selectors/marketShares'
import { getCurrentAccount } from 'integrations/store/selectors'
import { hexWithPrefix } from 'utils/helpers'

const eventMarketSelector = marketAddress => (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  if (!state.entities.markets[marketAddress]) {
    return {}
  }

  const market = state.entities.markets[marketAddress]
  const eventAddress = hexWithPrefix(market.event)

  return { [eventAddress]: market }
}

const getMarketShares = marketAddress =>
  createSelector(
    getOracles,
    getEvents,
    getEventDescriptions,
    eventMarketSelector(marketAddress),
    eventSharesSelector,
    getCurrentAccount,
    enhanceShares,
  )

export default getMarketShares
