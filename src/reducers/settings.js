import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    console.log('REDUX ', state)
    const data = action.payload
    let result = {}
    data.map((item) => {
      if (item.key && item.value) {
        result[item.key] = item.value
      }
    })
    return result
  },
}, {})

export default reducer
