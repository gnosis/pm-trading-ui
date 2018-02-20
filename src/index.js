import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import { initProviders } from 'integrations/store/actions'
import Decimal from 'decimal.js'
import React from 'react'
import { ConnectedRouter } from 'react-router-redux'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer as AppHOC } from 'react-hot-loader'
import 'scss/style.scss'
import AppRouter from 'routes'
import initGoogleAnalytics from 'utils/analytics/init'
import AppContainer from 'containers/App'
import BackdropProvider from 'containers/BackdropProvider'
import store, { history } from 'store'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initProviders())

Decimal.set({ toExpPos: 9999, precision: 50 })

initGoogleAnalytics()

/* global document */
const rootElement = document.getElementById('root')

const render = (App) => {
  ReactDOM.render(
    <AppHOC>
      <Provider store={store}>
        <BackdropProvider>
          <ConnectedRouter history={history}>
            <AppContainer>
              <App />
            </AppContainer>
          </ConnectedRouter>
        </BackdropProvider>
      </Provider>
    </AppHOC>,
    rootElement,
  )
}

Raven.context(() => render(AppRouter))

if (module.hot) {
  module.hot.accept('./routes', () => Raven.context(() => render(require('./routes').default)))
}
