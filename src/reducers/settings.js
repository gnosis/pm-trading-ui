import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    const data = action.payload
    return {
      ...state,
      settings: data.settings,
    }
  },
}, [])

export default reducer
