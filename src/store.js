import { hashHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import CrashReporter from 'middlewares/CrashReporter'
import LocalStorageDump from 'middlewares/LocalStorageDump'
import LocalStorageLoad from 'middlewares/LocalStorageLoad'

import reducer from 'reducers'

const enhancers = [
  applyMiddleware(
    thunk,
    routerMiddleware(hashHistory),
    LocalStorageLoad,
    LocalStorageDump,
    CrashReporter,
  ),
]

/* global window */
if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension())
}

const store = createStore(
  reducer, compose(...enhancers),
)

export default store
