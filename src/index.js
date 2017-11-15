import 'babel-polyfill'
import 'whatwg-fetch'
import { initProviders } from 'actions/blockchain'
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
import store from 'store'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initProviders())

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

render(AppRouter)

if (module.hot) {
  module.hot.accept('./router', () => render(require('./router').default))
}
