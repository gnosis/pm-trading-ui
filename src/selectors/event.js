import { entitySelector } from './entities'

export const EVENT_TYPE_CATEGORICAL = 'CATEGORICAL'
export const EVENT_TYPE_SCALAR = 'SCALAR'
export const EVENT_TYPE_UNKNOWN = 'UNKNOWN'

export const getEventByAddress = state => (marketEventAddress) => {
  let transformedEvent = {}
  if (marketEventAddress) {
    const categoricalEventEntities = entitySelector(state, 'categoricalEvent')
    const scalarEventEntities = entitySelector(state, 'scalarEvent')

    let event
    let eventType = EVENT_TYPE_UNKNOWN
    if (categoricalEventEntities[marketEventAddress]) {
      event = categoricalEventEntities[marketEventAddress]
      eventType = EVENT_TYPE_CATEGORICAL
    } else if (scalarEventEntities[marketEventAddress]) {
      event = scalarEventEntities[marketEventAddress]
      eventType = EVENT_TYPE_SCALAR
    }

    if (event) {
      const {
        id: eventAddress,
        factory: eventFactory,
        creator: eventCreator,
        creationDate: eventCreationDate,
        creationBlock: eventCreationBlock,
        oracle: oracleAddress,
        ...marketEvent
      } = event

      transformedEvent = {
        ...marketEvent,
        oracleAddress,
        eventType,
        eventAddress,
        eventFactory,
        eventCreator,
        eventCreationDate,
        eventCreationBlock,
      }
    }
  }

  return transformedEvent
}
