import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    const data = action.payload
    return {
      ...state,
      settings: data.values,
    }
    console.log('REDUCER: ', action)
    return state
  },
}, [''])

export default reducer
