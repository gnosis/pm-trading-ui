import { LOAD_SESSIONSTORAGE } from './SessionStorageLoad'
import { LOAD_LOCALSTORAGE } from './LocalStorageLoad'

const CLEAR_SESSION_STORAGE = 'CLEAR_SESSION_STORAGE'
const INIT = 'INIT'
const forbiddenActions = [INIT, CLEAR_SESSION_STORAGE, LOAD_LOCALSTORAGE, LOAD_SESSIONSTORAGE]

const PERSIST_PATHS = ['modal']

export default store => next => (action) => {
  const state = store.getState()

  if (forbiddenActions.indexOf(action.type) === -1) {
    const storage = {}

    PERSIST_PATHS.forEach((path) => {
      storage[path] = { ...(state[path].toJS()) }
    })

    window.sessionStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))

    return next(action)
  }
  next(action)
  return null
}
