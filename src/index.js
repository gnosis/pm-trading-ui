import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import RootComponent from 'components/Root'
import { initProviders } from 'integrations/store/actions'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import 'scss/style.scss'
import initGoogleAnalytics from 'utils/analytics/init'
import { isTournament } from 'utils/configuration'
import store from 'store'
import { WALLET_PROVIDER } from 'integrations/constants'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })
if (!isTournament()) {
  store.dispatch(initProviders())
} else {
  store.dispatch(initProviders({ providers: [WALLET_PROVIDER.REMOTE] }))
}

Decimal.set({ toExpPos: 9999, precision: 50 })

initGoogleAnalytics()

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
