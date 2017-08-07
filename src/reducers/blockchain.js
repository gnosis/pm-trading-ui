import { handleActions } from 'redux-actions'

import { setDefaultAccount, setConnectionStatus } from 'actions/blockchain'

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
}, {
  defaultAccount: undefined,
  connection: undefined,
  connectionTried: false,
})

export default reducer
