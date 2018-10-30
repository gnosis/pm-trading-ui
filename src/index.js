import 'babel-polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import RootComponent from 'components/Root'
import { initProviders } from 'integrations/store/actions'
import { initReadOnlyGnosis } from 'store/actions/blockchain'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import 'scss/style.scss'
import { isFeatureEnabled, getProviderConfig } from 'utils/features'

import { WALLET_PROVIDER } from 'integrations/constants'

import store from './store'
import { setMomentRelativeTime, setMomentDurationFormat } from './setup'
import './i18n'

const providerConfig = getProviderConfig()
const tournamentEnabled = isFeatureEnabled('tournament')

setMomentRelativeTime()
setMomentDurationFormat()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initReadOnlyGnosis())
if (!tournamentEnabled) {
  store.dispatch(initProviders())
} else {
  const tournamentProvider = WALLET_PROVIDER[providerConfig.default]
  store.dispatch(initProviders({ providers: [WALLET_PROVIDER.REMOTE, tournamentProvider] }))
}

Decimal.set({ toExpPos: 9999, precision: 50 })

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
