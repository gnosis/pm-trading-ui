import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import { initProviders } from 'actions/providers'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import 'less/style.less'
import AppRouter from 'router'
import initGoogleAnalytics from 'utils/analytics/init'
import BackdropProvider from 'containers/BackdropProvider'
import { areCredentialsValid } from 'integrations/uport/connector'
import store from 'store'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })

const credentialsAreValid = areCredentialsValid()
if (credentialsAreValid) {
  store.dispatch(initProviders())
}

Decimal.set({ toExpPos: 9999, precision: 50 })

initGoogleAnalytics()

/* global document */
const rootElement = document.getElementById('root')

// changed to browserHistory because for some reason with hashHistory render() of App
// component is triggered twice and this breaks page transition animations
const history = syncHistoryWithStore(browserHistory, store)

const render = (App) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BackdropProvider>
          <App history={history} />
        </BackdropProvider>
      </Provider>
    </AppContainer>,
    rootElement,
  )
}

Raven.context(() => render(AppRouter))

if (module.hot) {
  module.hot.accept('./router', () => Raven.context(() => render(require('./router').default)))
}
