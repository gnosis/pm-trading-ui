import { get } from 'lodash'
import { entitySelector } from 'store/selectors/entities'
import { getMarketById } from 'store/selectors/market'
import { hexWithPrefix } from 'utils/helpers'

export const EVENT_TYPE_CATEGORICAL = 'CATEGORICAL'
export const EVENT_TYPE_SCALAR = 'SCALAR'
export const EVENT_TYPE_UNKNOWN = 'UNKNOWN'

export const getEventByAddress = state => (marketEventAddress) => {
  if (marketEventAddress) {
    const eventEntities = entitySelector(state, 'events')
    return get(eventEntities, marketEventAddress)
  }

  return undefined
}

export const getEvents = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.events) {
    return {}
  }

  return state.entities.events
}

export const eventMarketsSelector = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  const { markets } = state.entities
  const eventMarkets = {}

  const marketSelector = getMarketById(state)

  Object.keys(markets).forEach((marketAddress) => {
    eventMarkets[markets[marketAddress].event] = marketSelector(marketAddress)
  })

  return eventMarkets
}

export const eventMarketSelector = marketAddress => (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  if (!state.entities.markets[marketAddress]) {
    return {}
  }

  const market = getMarketById(state)(marketAddress)
  const eventAddress = hexWithPrefix(market.event.address)

  return { [eventAddress]: market }
}
