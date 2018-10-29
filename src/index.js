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
import store from 'store'
import { WALLET_PROVIDER } from 'integrations/constants'
import { setMomentRelativeTime, setMomentDurationFormat } from './setup'

setMomentRelativeTime()
setMomentDurationFormat()

// load data from localstorage
store.dispatch({ type: 'INIT' })
store.dispatch(initReadOnlyGnosis())

store.dispatch(initProviders({ provider: WALLET_PROVIDER.REMOTE }))

Decimal.set({ toExpPos: 9999, precision: 50 })

/* global document */
const rootElement = document.getElementById('root')

const render = () => {
  ReactDOM.render(<RootComponent />, rootElement)
}

Raven.context(() => render())
