import { handleActions } from 'redux-actions'

import { setDefaultAccount } from 'actions/blockchain'

const reducer = handleActions({
  [setDefaultAccount]: (state, action) => {
    const account = action.payload
    return {
      ...state,
      defaultAccount: account,
    }
  },
}, {
  defaultAccount: undefined,
})

export default reducer
