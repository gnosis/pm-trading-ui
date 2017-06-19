import _ from 'lodash'

import { entitySelector } from './entities'

const EVENT_TYPE_CATEGORICAL = 'CATEGORICAL'
const EVENT_TYPE_SCALAR = 'SCALAR'

const ORACLE_TYPE_CENTRALIZED = 'CENTRALIZED'

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'market')
  const categoricalEventEntities = entitySelector(state, 'categoricalEvent')
  const scalarEventEntities = entitySelector(state, 'scalarEvent')

  const centralizedOracleEntities = entitySelector(state, 'centralizedOracle')
  const categoricalEventDescriptionEntities = entitySelector(state, 'categoricalEventDescription')
  const scalarEventDescriptionEntities = entitySelector(state, 'scalarEventDescription')

  return Object.keys(marketEntities).map((marketAddress) => {
    const { event: eventAddress, ...market } = marketEntities[marketAddress]

    // Event assignment
    market.event = {}
    if (categoricalEventEntities[eventAddress]) {
      market.event = categoricalEventEntities[eventAddress]
      market.eventType = EVENT_TYPE_CATEGORICAL
    } else if (scalarEventEntities[eventAddress]) {
      market.event = scalarEventEntities[eventAddress]
      market.eventType = EVENT_TYPE_SCALAR
    }

    // Oracle assignment
    market.oracle = {}
    if (market.event.oracle) {
      if (centralizedOracleEntities[market.event.oracle]) {
        market.oracle = centralizedOracleEntities[market.event.oracle]
        market.oracleType = ORACLE_TYPE_CENTRALIZED
      }
    }

    // Event description assignment
    market.eventDescription = {}
    if (market.oracle.eventDescription) {
      if (categoricalEventDescriptionEntities[market.oracle.eventDescription]) {
        market.eventDescription =
          categoricalEventDescriptionEntities[market.oracle.eventDescription]
      } else if (scalarEventDescriptionEntities[market.oracle.eventDescription]) {
        market.eventDescription =
          scalarEventDescriptionEntities[market.oracle.eventDescription]
      }
    }

    return market
  })
}

export default {
  getMarkets,
}
