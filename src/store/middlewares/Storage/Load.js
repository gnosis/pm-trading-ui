import * as actions from './actions'
import { NOOP_MIDDLEWARE, LOCALSTORAGE_KEY } from './constants'

const middleware = (storage) => {
  const storageIsValid = storage instanceof Storage

  if (!storageIsValid) {
    console.warn('StorageLoader: Storage is either not supported or invalid')
    return NOOP_MIDDLEWARE
  }

  return store => next => (action) => {
    const { type } = action
    if (type === 'INIT') {
      const stringPayload = storage.getItem(LOCALSTORAGE_KEY)
      if (stringPayload) {
        let payload
        try {
          const decoded = Buffer.from(stringPayload).toString('ascii')
          payload = JSON.parse(decoded)
          store.dispatch(actions.loadLocalstorage(payload))
        } catch (e) {
          console.error('Could not load saved storage')
        }
      }
    }

    next(action)
  }
}

export default middleware
