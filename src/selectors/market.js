import { entitySelector } from './entities'
import { getEventByAddress } from './event'
import { getOracleByAddress } from './oracle'
import { getEventDescriptionByAddress } from './eventDescription'

export const getMarketById = state => (marketAddress) => {
  const marketEntities = entitySelector(state, 'markets')

  let market = {}
  if (marketEntities[marketAddress]) {
    const marketEntity = marketEntities[marketAddress]

    const marketEvent = getEventByAddress(state)(marketEntity.event)
    const eventOracle = getOracleByAddress(state)(marketEvent.oracle)
    const oracleEventDescription =
      getEventDescriptionByAddress(state)(eventOracle.eventDescription)

    market = {
      ...marketEntities[marketAddress],
      event: marketEvent,
      oracle: eventOracle,
      eventDescription: oracleEventDescription,
    }
  }

  return market
}

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'markets')

  return Object.keys(marketEntities).map(getMarketById(state))
}

export const filterMarkets = state => (opts) => {
  const marketEntities = getMarkets(state)

  const { textSearch, resolved } = opts
  
  return marketEntities
    .filter(market =>
    (!textSearch ||
      market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
      market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1) &&
    (typeof resolved === 'undefined' || (resolved === 'RESOLVED' && market.oracle.isOutcomeSet) || (resolved === 'UNRESOLVED' && !market.oracle.isOutcomeSet)),
  )
}

export default {
  getMarkets,
}
