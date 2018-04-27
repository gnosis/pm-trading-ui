import { pick } from 'lodash'

const CLEAR_SESSION_STORAGE = 'CLEAR_SESSION_STORAGE'
const INIT = 'INIT'

const PERSIST_PATHS = ['modal']

export default store => next => (action) => {
  const state = store.getState()

  if (action.type !== CLEAR_SESSION_STORAGE && action.type !== INIT) {
    let storage = {}

    PERSIST_PATHS.forEach((path) => {
      storage = {
        [path]: state[path].toJS ? state[path].toJS() : state[path],
      }
    })

    // eslint-disable-next-line no-undef
    window.sessionStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))

    return next(action)
  }
  next(action)
  return null
}
