import { get } from 'lodash'
import { entitySelector } from 'selectors/entities'

export const getOracleByAddress = state => (eventOracleAddress) => {
  if (eventOracleAddress) {
    const oracleEntities = entitySelector(state, 'oracles')
    return get(oracleEntities, eventOracleAddress)
  }

  return undefined
}

export const getOracles = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.oracles) {
    return {}
  }

  return state.entities.oracles
}
