import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    const data = action.payload
    let result = {}
    data.map((item) => {
      result[item.key] = item.value
    })
    return result
  },
}, {})

export default reducer
