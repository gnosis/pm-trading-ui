import { handleActions } from 'redux-actions'
import { Map, List } from 'immutable'
import { showNotification, fadeOutNotification, hideAllNotifications } from 'store/actions/notifications'
import NotificationRecord from 'reducers/notifications/models/notification'

const reducer = handleActions(
  {
    [showNotification]: (state, action) =>
      state.withMutations((stateMap) => {
        stateMap.set('currentVisible', value => value.push(action.payload.id))
        stateMap.get('log').set(action.payload.id, new NotificationRecord(action.payload))
      }),
    [fadeOutNotification]: (state, action) =>
      state.set('currentVisible', value => value.filter(id => id !== action.payload.id)),
    [hideAllNotifications]: state => state.set('currentVisible', List()),
  },
  Map({
    log: Map(),
    currentVisible: List(),
  }),
)

export default reducer
