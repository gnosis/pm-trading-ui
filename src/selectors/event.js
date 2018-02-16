import { get } from 'lodash'
import { entitySelector } from 'selectors/entities'

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
