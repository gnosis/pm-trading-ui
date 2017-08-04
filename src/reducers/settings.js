import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    console.log('REDUX ', state)
    const data = action.payload
    let result = {}
    data.map((item) => {
      if (item.address && item.name) {
        result[item.address] = item.name
      }
    })
    return result
  },
}, {})

export default reducer
