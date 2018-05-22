import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import RootComponent from 'components/Root'
import { initProviders } from 'integrations/store/actions'
import { initReadOnlyGnosis } from 'actions/blockchain'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import 'scss/style.scss'
import initAnalytics from 'utils/analytics'
import { isFeatureEnabled, getProviderConfig } from 'utils/features'
import store from 'store'
import { WALLET_PROVIDER } from 'integrations/constants'
import { setMomentRelativeTime } from './setup'

const providerConfig = getProviderConfig()
const tournamentEnabled = isFeatureEnabled('tournament')

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initReadOnlyGnosis())
if (tournamentEnabled) {
  store.dispatch(initProviders())
} else {
  const tournamentProvider = WALLET_PROVIDER[providerConfig.default]
  store.dispatch(initProviders({ providers: [WALLET_PROVIDER.REMOTE, tournamentProvider] }))
}

initAnalytics()
Decimal.set({ toExpPos: 9999, precision: 50 })

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
