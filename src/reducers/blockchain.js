import { handleActions } from 'redux-actions'

import {
  setConnectionStatus,
  setGnosisInitialized,
  setGasCost,
  setGasPrice,
  setActiveProvider,
  registerProvider,
  updateProvider,
  setEtherTokens,
  setActiveNetworks,
} from 'actions/blockchain'
import { GAS_COST } from 'utils/constants'

const INITIAL_PROVIDER_STATE = {
  loaded: false,
  available: false,
  network: undefined,
  account: undefined,
  balance: undefined,
  priority: 1,
}

const reducer = handleActions({
  [setConnectionStatus]: (state, action) => {
    const { connection } = action.payload
    return {
      ...state,
      connection,
      connectionTried: true,
    }
  },
  [setActiveNetworks]: (state, action) => {
    const { currentNetwork, targetNetwork } = action.payload

    return {
      ...state,
      currentNetwork,
      targetNetwork,
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
  [setActiveProvider]: (state, action) => ({
    ...state,
    activeProvider: action.payload,
  }),
  [registerProvider]: (state, action) => {
    const { provider: name, ...provider } = action.payload
    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          name,
          ...INITIAL_PROVIDER_STATE,
          ...provider,
        },
      },
    }
  },
  [updateProvider]: (state, action) => {
    const { provider: name, ...provider } = action.payload

    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          ...state.providers[name],
          loaded: true,
          ...provider,
        },
      },
    }
  },
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
  connection: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: undefined,
  etherTokens: undefined,
  currentNetwork: undefined,
  targetNetwork: undefined,
})

export default reducer
