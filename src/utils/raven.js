/* global window */
import Raven from 'raven-js'

import createRavenMiddleware from 'raven-for-redux'
import { getCurrentAccount } from 'selectors/blockchain'

const isProduction = process.env.NODE_ENV === 'production'

const MIDDLEWARE_WITH_RAVEN = store => next => (action) => {
  const { type } = action

  // set_active_provider switches to a different provider with probably a different account id
  // init_providers will be called right after localstorage has loaded everything, we probably have an account at this point
  if (type === 'SET_ACTIVE_PROVIDER' || type === 'INIT_PROVIDERS') {
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
    throw err
  }
}

const INFURA_REGEX = /infura\.io/i
const RELEASE_REGEX = /release\-/i

const ENV_MAPPING = {
  master: 'staging',
  development: 'development',
}

let ENV = ENV_MAPPING[process.env.TRAVIS_BRANCH] ? ENV_MAPPING[process.env.TRAVIS_BRANCH] : 'other'
if (RELEASE_REGEX.test(process.env.TRAVIS_BRANCH)) {
  ENV = 'production'
}
Raven.config(isProduction ? process.env.RAVEN_ID : undefined, {
  maxBreadcrumbs: 20,
  release: process.env.TRAVIS_BUILD_ID,
  environment: ENV,
  ignoreUrls: [
    /infura\.io/i,
  ],
  breadcrumbCallback: (crumb) => {
    if (crumb.type === 'http' && INFURA_REGEX.test(crumb.data.url)) {
      return false
    }

    return crumb
  },
}).install()

const formatPromiseRejectionEvent = (event) => {
  if (!event) {
    return 'Unknown Promise Rejection Error'
  }

  if (event.message != null) {
    return event.message
  }

  if (event.reason == null || (typeof event.reason === 'object' && !Object.keys(event.reason).length)) {
    const isEmptyObject = !Object.keys(event).length

    return isEmptyObject ? 'Unknown Promise Rejection Error' : JSON.stringify(event)
  }

  if (typeof event.reason !== 'string') {
    const isEmptyObject = !Object.keys(event.reason).length

    return isEmptyObject ? 'Unknown Promise Rejection Error' : JSON.stringify(event.reason)
  }

  return event.reason
}

class RavenIntegration {
  constructor() {
    if (isProduction) {
      window.onunhandledrejection = (evt) => {
        Raven.captureException(formatPromiseRejectionEvent(evt))
      }
    }
  }

  getMiddlewares() {
    return isProduction ? [
      MIDDLEWARE_WITH_RAVEN,
      createRavenMiddleware(Raven, {
        stateTransformer: (state) => {
          const {
            // eslint-disable-next-line no-unused-vars
            entities, olympia: { ranking }, ...newState
          } = state
          return newState
        },
      }),
    ] : [
      MIDDLEWARE_ERROR_LOG,
    ]
  }

  throwError(err) {
    if (isProduction) {
      Raven.captureException(err)
    }
  }

  recordAction(message, category, data) {
    if (isProduction) {
      Raven.captureBreadcrumb({
        message,
        category,
        data,
      })
    }
  }
}

export default new RavenIntegration()
