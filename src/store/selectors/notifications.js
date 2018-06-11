import { List } from 'immutable'

export const getVisibleNotifications = state =>
  state.notifications.get('currentVisible', List()).map(id => state.notifications.getIn(['log', id]))
