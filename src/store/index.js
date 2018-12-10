import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import RavenIntegration from 'utils/raven'

import Blockchain from 'store/middlewares/Blockchain'
import Providers from 'store/middlewares/Providers'
// import Intercom from 'middlewares/Intercom'

import {
  LocalStorageLoad, LocalStorageDump, SessionStorageLoad, SessionStorageDump,
} from 'store/middlewares/Storage'

import Notifications from 'store/middlewares/Notifications'

import reducer from 'store/reducers'

const middlewares = [
  thunk,
  Notifications,
  Blockchain,
  Providers,
  SessionStorageLoad,
  LocalStorageLoad,
  SessionStorageDump,
  LocalStorageDump,
  // ...RavenIntegration.getMiddlewares(),
  // Intercom,
]

const enhancers = [applyMiddleware(...middlewares)]

/* global window */
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) // eslint-disable-line
  : compose

const store = createStore(reducer, composeEnhancers(...enhancers))

export default store
