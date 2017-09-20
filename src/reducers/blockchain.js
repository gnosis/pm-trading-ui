import { handleActions } from 'redux-actions'

import { setGnosisStatus, setDefaultAccount, setConnectionStatus, setGasCost, setGasPrice, registerProvider, updateProvider } from 'actions/blockchain'
import { GAS_COST } from 'utils/constants'

const reducer = handleActions({
  [setGnosisStatus]: (state, action) => {
    
    return {
      ...state,
    }
  },
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
  [registerProvider]: (state, action) => {
    const { provider: name, ...provider } = action.payload
    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          name,
          loaded: false,
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
      activeProvider: !state.activeProvider && provider.available ? name : state.activeProvider,
      providersLoaded: true,
    }
  },
}, {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  defaultAccount: undefined,
  connection: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: null,
})

export default reducer
