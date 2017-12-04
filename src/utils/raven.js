/* global window */
import Raven from 'raven-js'

import createRavenMiddleware from 'raven-for-redux'
import { getCurrentAccount } from 'selectors/blockchain'

import config from 'config.json'

const RAVEN_ID = isProduction ? 
const MIDDLEWARE_WITH_RAVEN = store => next => (action) => {
  const { type, payload } = action
  if (type === 'SET_ACTIVE_PROVIDER') {
    (async () => {
      const state = store.getState()
      const accountId = getCurrentAccount(state)
      Raven.setUserContext({ accountAddress: accountId })
    })()
  }

  try {
    return next(action)
  } catch (err) {
    Raven.captureException(err)
    throw err
  }
}

const MIDDLEWARE_ERROR_LOG = () => next => (action) => {
  try {
    return next(action)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    throw err
  }
}

Raven.config(process.env.NODE_ENV === 'production' ? RAVEN_ID : false, {
  maxBreadcrumbs: 20,
  release: process.env.CI_PIPELINE_ID,
  environment: process.env.CI_ENVIRONMENT_NAME,
}).install()


class RavenIntegration {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    if (this.isProduction) {
      window.onunhandledrejection = (evt) => {
        Raven.captureException(evt.reason)
      }
    }
  }

  getMiddlewares() {
    return this.isProduction ? [
      MIDDLEWARE_WITH_RAVEN,
      createRavenMiddleware(Raven, {
        stateTransformer: (state) => {
          // eslint-disable-next-line no-unused-vars
          const { entities, reference, notePaging, tag, ...newState } = state
          return newState
        },
      }),
    ] : [
      MIDDLEWARE_ERROR_LOG,
    ]
  }

  throwError(err) {
    if (this.isProduction) {
      Raven.captureException(err)
    }
  }
}

export default new RavenIntegration()
