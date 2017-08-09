import { updateEntity } from 'actions/entities'
import { getOracleByAddress } from 'selectors/oracle'
import * as api from 'api'

export const resolveOracle = (oracleAddress, outcomeIndex) => async (dispatch, getState) => {
  const oracle = getOracleByAddress(getState())(oracleAddress)

  await api.resolveOracle(oracle, outcomeIndex)

  return dispatch(updateEntity({ entityType: 'oracles', data: { id: oracleAddress, isOutcomeSet: true } }))
}
