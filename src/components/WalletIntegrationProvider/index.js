import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectBlockchain, initGnosis } from 'actions/blockchain'
// import { getCurrentAccount } from 'api'
import { getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'
import config from 'config'


export default class WalletIntegrationProvider extends Component {

  constructor(props) {
    super(props)
    const { integrations, store } = props
    const initializers = Object.keys(integrations).map(integrationName => integrations[integrationName])


    // Execute providers inizialization sequentially
    const init = (funcs, _store) => {
      if (funcs.length > 0) {
        return funcs[0].initialize(_store).then(
          () => init(funcs.slice(1), _store),
        )
      }
      // Gnosis initialization needed after providers init
      // Get selected provider
      const selectedProvider = getSelectedProvider(_store.getState())
      // get Gnosis options
      const opts = this.getGnosisOptions(selectedProvider)
      // init Gnosis connection
      _store.dispatch(initGnosis(opts)).then(() => _store.dispatch(connectBlockchain()))
      return null
    }

    window.addEventListener('load', () => init(initializers, store))
  }

  getGnosisOptions(provider) {
    const opts = {}

    if (provider && provider.name === WALLET_PROVIDER.METAMASK) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else if (provider && provider === WALLET_PROVIDER.PARITY) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else {
      // Default remote node
      opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${config.ethereum.protocol}://${config.ethereum.host}:${config.ethereum.port}`)).currentProvider
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
