import { entitySelector } from './entities'
import { getEventByAddress } from './event'
import { getOracleByAddress } from './oracle'
import { getEventDescriptionByAddress } from './eventDescription'

export const getMarketById = state => (marketAddress) => {
  const marketEntities = entitySelector(state, 'market')

  let market = {}
  if (marketEntities[marketAddress]) {
    const marketEntity = marketEntities[marketAddress]

    const marketEvent = getEventByAddress(state)(marketEntity.event)
    const eventOracle = getOracleByAddress(state)(marketEvent.oracleAddress)
    const eventDescription =
      getEventDescriptionByAddress(state)(eventOracle.eventDescriptionAddress)

    market = {
      address: marketAddress,
      creator: marketEntity.creator,
      creationDate: marketEntity.creationDate,
      creationBlock: marketEntity.creationBlock,
      marketMaker: marketEntity.marketMaker,
      fee: marketEntity.fee,
      funding: marketEntity.funding,
      netOutcomeTokensSold: marketEntity.netOutcomeTokensSold,
      stage: marketEntity.stage,
      ...marketEvent,
      ...eventOracle,
      ...eventDescription,
    }
  }

  return market
}

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'market')

  return Object.keys(marketEntities).map(getMarketById(state))
}

export default {
  getMarkets,
}
