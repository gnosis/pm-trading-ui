const INIT = 'INIT'

export const STORAGE_KEY = `GNOSIS_${process.env.VERSION}`
export const STORAGE_SAVE_INTERVAL = 500

export const IGNORE_ACTIONS = [INIT]

export const NOOP_MIDDLEWARE = () => next => action => next(action)
