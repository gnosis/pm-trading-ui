import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import RootComponent from 'components/root'
import { initProviders } from 'integrations/store/actions'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import 'scss/style.scss'
import initGoogleAnalytics from 'utils/analytics/init'
import store from 'store'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initProviders())

Decimal.set({ toExpPos: 9999, precision: 50 })

initGoogleAnalytics()

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
