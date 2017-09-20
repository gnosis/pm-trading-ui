import { handleActions } from 'redux-actions'

import { setDefaultAccount, setConnectionStatus, setGasCost, setGasPrice, setEtherTokens } from 'actions/blockchain'
import { GAS_COST } from 'utils/constants'

const reducer = handleActions({
  [setDefaultAccount]: (state, action) => {
    const account = action.payload
    return {
      ...state,
      defaultAccount: account,
    }
  },
  [setConnectionStatus]: (state, action) => {
    const { connection } = action.payload
    return {
      ...state,
      connection,
      connectionTried: true,
    }
  },
  [setGasCost]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.contractType]: action.payload.gasCost,
    },
  }),
  [setGasPrice]: (state, action) => ({
    ...state,
    [action.payload.entityType]: action.payload.gasPrice,
  }),
  [setEtherTokens]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.account]: action.payload.etherTokens,
    },
  }),
}, {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  defaultAccount: undefined,
  connection: undefined,
  connectionTried: false,
  etherTokens: undefined,
})

export default reducer
