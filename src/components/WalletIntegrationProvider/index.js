import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectBlockchain, initGnosis } from 'actions/blockchain'
// import { getCurrentAccount } from 'api'
import { getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import { config } from 'config'

export default class WalletIntegrationProvider extends Component {

  constructor(props) {
    super(props)
    const { integrations, store } = props

    Promise.all(
      Object.keys(integrations).map(
        (integrationName) => {
          return integrations[integrationName].initialize(store)
        },
      ),
    )
    .then(() => {
      // Get selected provider
      const selectedProvider = getSelectedProvider(store.getState())
      // get Gnosis options
      const opts = this.getGnosisOptions(selectedProvider)
      // init Gnosis connection
      store.dispatch(initGnosis(opts)).then(() => store.dispatch(connectBlockchain()))
    })
  }

  getGnosisOptions(provider) {
    const opts = {}
    if (provider.name === WALLET_PROVIDER.METAMASK) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else if (provider === WALLET_PROVIDER.PARITY) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else {
      opts.ethereum = `${config.ethereum.protocol}://${config.ethereum.host}:${config.ethereum.port}`
    }

    return opts
  }

  render() {
    const { children } = this.props

    return children
  }
}

WalletIntegrationProvider.propTypes = {
  integrations: PropTypes.object,
  store: PropTypes.object,
}
