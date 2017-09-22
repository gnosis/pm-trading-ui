import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import 'less/style.less'

import AppRouter from 'router'
import BackdropProvider from "containers/BackdropProvider";
import store from 'store'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

const history = syncHistoryWithStore(hashHistory, store)

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
  module.hot.accept('./router', () => 
    render(require('./router').default)
  )
}
