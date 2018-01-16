import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
// import RavenIntegration from 'utils/raven'

import Blockchain from 'middlewares/Blockchain'
import Providers from 'middlewares/Providers'
// import Intercom from 'middlewares/Intercom'
import LocalStorageDump from 'middlewares/LocalStorageDump'
import LocalStorageLoad from 'middlewares/LocalStorageLoad'
import Notifications from 'middlewares/Notifications'

import reducer from 'reducers'

const middlewares = [
  thunk,
  routerMiddleware(browserHistory),
  Notifications,
  Blockchain,
  Providers,
  LocalStorageLoad,
  LocalStorageDump,
  // ...RavenIntegration.getMiddlewares(),
  // Intercom,
  Providers,
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
