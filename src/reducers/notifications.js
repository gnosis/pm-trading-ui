import { handleActions } from 'redux-actions'

import {
  showNotification,
} from 'actions/notifications'

const reducer = handleActions({
  [showNotification]: (state, action) => ({
    ...state,
    log: [
      { ...action.payload },
      ...state.log,
    ],
  }),
}, { log: [] })

export default reducer
