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
          ...provider,
        },
      },
      activeProvider: !state.activeProvider && provider.enabled ? name : state.activeProvider,
    }
  },
}, {
  providers: {},
  activeProvider: null,
})

export default reducer
