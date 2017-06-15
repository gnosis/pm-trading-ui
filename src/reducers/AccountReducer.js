import { handleActions } from 'redux-actions'

import { setAccount } from 'actions/account'

const reducer = handleActions({
  [setAccount]: (state, action) => ({
    ...state,
    address: action.payload,
  }),
}, { address: null })

export default reducer
