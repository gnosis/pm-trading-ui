import { entitySelector } from './entities'

export const ORACLE_TYPE_CENTRALIZED = 'CENTRALIZED'
export const ORACLE_TYPE_UNKNOWN = 'UNKNOWN'

export const getOracleByAddress = state => (eventOracleAddress) => {
  let transformedOracle = {}
  if (eventOracleAddress) {
    const centralizedOracleEntities = entitySelector(state, 'centralizedOracle')

    if (eventOracleAddress) {
      let oracle
      let oracleType = ORACLE_TYPE_UNKNOWN
      if (centralizedOracleEntities[eventOracleAddress]) {
        oracle = centralizedOracleEntities[eventOracleAddress]
        oracleType = ORACLE_TYPE_CENTRALIZED
      }

      if (oracle) {
        const {
          id: oracleAddress,
          factory: oracleFactory,
          creator: oracleCreator,
          creationDate: oracleCreationDate,
          creationBlock: oracleCreationBlock,
          owner: oracleOwner,
          eventDescription: eventDescriptionAddress,
          ...eventOracle
        } = oracle
        transformedOracle = {
          ...eventOracle,
          eventDescriptionAddress,
          oracleType,
          oracleAddress,
          oracleFactory,
          oracleCreator,
          oracleCreationDate,
          oracleCreationBlock,
          oracleOwner,
        }
      }
    }
  }

  return transformedOracle
}
