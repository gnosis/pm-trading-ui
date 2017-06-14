import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import App from 'containers/App'
import MarketOverviewPage from 'containers/EventOverviewPage'

import 'less/style.less'

import store from './store'

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

const history = syncHistoryWithStore(hashHistory, store)

// TODO: refactor: https://github.com/reactjs/redux/issues/227
// history.listen(location => store.dispatch(changeLocation(location)))

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="markets" />
        <Route path="markets" component={MarketOverviewPage} />
      </Route>
    </Router>
  </Provider>,
  rootElement,
)
