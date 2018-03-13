import { createSelector } from 'reselect'
import { getEvents } from 'selectors/event'
import { getOracles } from 'selectors/oracle'
import { getEventDescriptions } from 'selectors/eventDescription'
import { eventMarketSelector } from 'selectors/marketTrades'
import { eventSharesSelector, enhanceShares } from 'selectors/marketShares'
import { getCurrentAccount } from 'integrations/store/selectors'

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
