import { get } from 'lodash'
import { entitySelector } from 'store/selectors/entities'

export const getEventDescriptionByAddress = state => (oracleEventDescriptionAddress) => {
  if (oracleEventDescriptionAddress) {
    const eventEntities = entitySelector(state, 'eventDescriptions')
    return get(eventEntities, oracleEventDescriptionAddress)
  }

  return undefined
}

export const getEventDescriptions = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.eventDescriptions) {
    return {}
  }

  return state.entities.eventDescriptions
}
