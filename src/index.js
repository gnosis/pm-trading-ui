import '@babel/polyfill'
import 'whatwg-fetch'
import Raven from 'raven-js'
import RootComponent from 'components/Root'
import { initReadOnlyGnosis, updateCollateralToken, requestTargetNetworkId } from 'store/actions/blockchain'
import { getLastUsedProvider } from 'integrations/utils'
import Decimal from 'decimal.js'
import React from 'react'

import ReactDOM from 'react-dom'
import 'scss/style.scss'
import store from 'store'

import { setMomentRelativeTime, setMomentDurationFormat } from './setup'

const lastUsedProvider = getLastUsedProvider()

setMomentRelativeTime()
setMomentDurationFormat()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initReadOnlyGnosis())
store.dispatch(updateCollateralToken())
store.dispatch({ type: 'CHECK_AVAILABLE_PROVIDERS' })
store.dispatch(requestTargetNetworkId())

if (lastUsedProvider) {
  store.dispatch({ type: 'TRY_TO_INIT_LAST_USED_PROVIDER', payload: lastUsedProvider })
}

// TODO: Add remote provider for NODE_ENV=development
// store.dispatch(initProviders({ provider: WALLET_PROVIDER.REMOTE }))

Decimal.set({ toExpPos: 9999, precision: 50 })

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
