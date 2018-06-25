import { throttle, mapValues, omit, pick } from 'lodash'
import { NOOP_MIDDLEWARE, STORAGE_KEY, IGNORE_ACTIONS, STORAGE_SAVE_INTERVAL } from './constants'

// Ensures that saveLocalstorage is only invoked at max every STORAGE_SAVE_INTERVAL ms
const saveStorage = throttle((store, storage, options) => {
  const whitelist = options.whitelist || []
  const blacklist = options.blacklist || []

  const applicationState = store.getState()
  let payload = mapValues(applicationState, (reducer) => {
    if (typeof reducer.toJS === 'function') {
      return reducer.toJS()
    }

    return reducer
  })

  // only save special paths from whitelist, if exists
  if (whitelist && whitelist.length > 0) {
    payload = pick(payload, whitelist)
  }

  // omit paths from blacklist, if exists
  if (blacklist && blacklist.length > 0) {
    payload = omit(payload, blacklist)
  }

  const stringStorage = JSON.stringify(payload)
  const encoded = Buffer.from(stringStorage).toString('base64')

  storage.setItem(STORAGE_KEY, encoded)
}, STORAGE_SAVE_INTERVAL)


const middleware = (storage, whitelist) => {
  const storageIsValid = storage instanceof Storage

  if (!storageIsValid) {
    console.warn('StorageDumper: Storage is either not supported or invalid')
    return NOOP_MIDDLEWARE
  }

  return store => next => (action) => {
    const isActionIgnored = IGNORE_ACTIONS.indexOf(action) === -1
    if (isActionIgnored) {
      saveStorage(store, storage, whitelist)
    }
    next(action)
  }
}

export default middleware
