import { handleActions } from 'redux-actions'

import { setConnectionStatus, setGnosisInitialized, setGasCost, setGasPrice, setEtherTokens } from 'actions/blockchain'

import { GAS_COST } from 'utils/constants'

const reducer = handleActions(
  {
    [setConnectionStatus]: (state, action) => {
      const { connection } = action.payload
      return {
        ...state,
        connection,
        connectionTried: true,
      }
    },
    [setGnosisInitialized]: (state, action) => {
      const { initialized } = action.payload
      return {
        ...state,
        gnosisInitialized: initialized,
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
  },
  {
    gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
    gasPrice: undefined,
    connection: undefined,
    connectionTried: false,
    providers: {},
    activeProvider: undefined,
    etherTokens: undefined,
  },
)

export default reducer
