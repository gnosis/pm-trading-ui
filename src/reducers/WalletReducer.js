import { handleActions } from 'redux-actions'

import { registerWallet, updateWallet } from 'actions/wallet'

const reducer = handleActions({
  [registerWallet]: (state, action) => {
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
  [updateWallet]: (state, action) => {
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
  providers: {},
  activeProvider: null,
})

export default reducer
