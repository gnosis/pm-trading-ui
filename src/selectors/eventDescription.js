import { entitySelector } from './entities'

export const getEventDescriptionByAddress = state => (oracleEventDescriptionAddress) => {
  let transformedEventDescription = {}

  if (oracleEventDescriptionAddress) {
    const categoricalEventDescriptionEntities = entitySelector(state, 'categoricalEventDescription')
    const scalarEventDescriptionEntities = entitySelector(state, 'scalarEventDescription')

    if (oracleEventDescriptionAddress) {
      let eventDescription

      if (scalarEventDescriptionEntities[oracleEventDescriptionAddress]) {
        eventDescription = scalarEventDescriptionEntities[oracleEventDescriptionAddress]
      } else if (categoricalEventDescriptionEntities[oracleEventDescriptionAddress]) {
        eventDescription = categoricalEventDescriptionEntities[oracleEventDescriptionAddress]
      }

      if (eventDescription) {
        const {
          id: eventDescriptionAddress,
          ...oracleEventDescription
        } = eventDescription

        transformedEventDescription = {
          ...oracleEventDescription,
          eventDescriptionAddress,
        }
      }
    }
  }

  return transformedEventDescription
}
