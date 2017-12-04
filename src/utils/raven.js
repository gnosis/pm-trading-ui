/* global window */
import Raven from 'raven-js'

import createRavenMiddleware from 'raven-for-redux'
import { getCurrentAccount } from 'selectors/blockchain'

const MIDDLEWARE_WITH_RAVEN = store => next => (action) => {
  const { type } = action
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
Raven.config(process.env.RAVEN_ID, {
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
          const {
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
    if (this.isProduction) {
      Raven.captureException(err)
    }
  }
}

export default new RavenIntegration()
