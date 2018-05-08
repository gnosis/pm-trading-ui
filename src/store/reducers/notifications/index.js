import { handleActions } from 'redux-actions'
import { Map, List } from 'immutable'
import { showNotification, fadeOutNotification, hideAllNotifications } from 'store/actions/notifications'
import NotificationRecord from 'store/reducers/notifications/models/notification'

const reducer = handleActions(
  {
    [showNotification]: (state, action) =>
      state.withMutations((stateMap) => {
        stateMap.update('currentVisible', value => value.push(action.payload.id))
        stateMap.setIn(['log', action.payload.id], new NotificationRecord(action.payload))
      }),
    [fadeOutNotification]: (state, action) =>
      state.update('currentVisible', value => value.filter(id => id !== action.payload.id)),
    [hideAllNotifications]: state => state.set('currentVisible', List()),
  },
  Map({
    log: Map(),
    currentVisible: List(),
  }),
)

export default reducer
