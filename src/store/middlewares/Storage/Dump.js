import { throttle, mapValues, omit, pick } from 'lodash'
import { NOOP_MIDDLEWARE, LOCALSTORAGE_KEY, IGNORE_ACTIONS, LOCALSTORAGE_SAVE_INTERVAL } from './constants'

const OPTIONS_DEFAULT = {
  whitelist: [],
  blacklist: [],
}

// Ensures that saveLocalstorage is only invoked at max every LOCALSTORAGE_SAVE_INTERVAL ms
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
    let whitelistedPayload = {}

    whitelist.forEach((path) => {
      const data = pick(payload, path)

      if (data) {
        whitelistedPayload = {
          ...whitelistedPayload,
          ...data,
        }
      }
    })
    console.log(whitelistedPayload)

    payload = whitelistedPayload
  }

  if (blacklist && blacklist.length > 0) {
    payload = omit(payload, blacklist)
    console.log(payload)
  }

  const stringStorage = JSON.stringify(payload)
  const encoded = Buffer.from(stringStorage).toString('base64')

  storage.setItem(LOCALSTORAGE_KEY, encoded)
}, LOCALSTORAGE_SAVE_INTERVAL)


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
