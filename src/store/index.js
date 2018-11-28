import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import RavenIntegration from 'utils/raven'
import Providers from 'store/middlewares/Providers'
// import Intercom from 'middlewares/Intercom'

import {
  LocalStorageLoad,
  LocalStorageDump,
  SessionStorageLoad,
  SessionStorageDump,
} from 'store/middlewares/Storage'

import Notifications from 'store/middlewares/Notifications'

import reducer from 'store/reducers'

const middlewares = [
  thunk,
  Notifications,
  Providers,
  SessionStorageLoad,
  LocalStorageLoad,
  SessionStorageDump,
  LocalStorageDump,
  // ...RavenIntegration.getMiddlewares(),
  // Intercom,
]

const enhancers = [
  applyMiddleware(...middlewares),
]

/* global window */
if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension())
}

const store = createStore(reducer, compose(...enhancers))

export default store
