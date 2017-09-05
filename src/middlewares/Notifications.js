import {
  showNotification,
} from 'actions/notifications'

export default store => next => (action) => {
  const { type, payload } = action
  if (type === 'CLOSE_TRANSACTION_LOG') {
    // intercept close log messages, fire notification handler
    store.dispatch(showNotification({
      ...payload,
    }))
  }

  return next(action)
}
