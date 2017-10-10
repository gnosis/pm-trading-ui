import { Component } from 'react'
import PropTypes from 'prop-types'
import { connectBlockchain, initGnosis, setActiveProvider } from 'actions/blockchain'
import { findDefaultProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'


export default class WalletIntegrationProvider extends Component {
  constructor(props) {
    super(props)
    const { integrations, store } = props

    // Execute providers inizialization sequentially
    const init = async (integrationNames, reactStore) => {
      const integrationName = integrationNames.pop()

      if (integrationName) {
        const integration = integrations[integrationName]
        const success = await integration.initialize(store)
        if (success) {
          console.log(`Integration available: ${integrationName}`)
        }

        return init(integrationNames, reactStore)
      }
      
      // Gnosis initialization needed after providers init
      
      // Get selected provider
      const defaultProvider = findDefaultProvider(reactStore.getState())
      await reactStore.dispatch(setActiveProvider(defaultProvider.name))
      // get Gnosis options
      const opts = this.getGnosisOptions(defaultProvider)
      // init Gnosis connection
      await reactStore.dispatch(initGnosis(opts))

      await reactStore.dispatch(connectBlockchain())
    }

    window.addEventListener('load', () => init(Object.keys(integrations), store))
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
      opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`)).currentProvider
    }

    return opts
  }

  render() {
    const { children } = this.props

    return children
  }
}

WalletIntegrationProvider.propTypes = {
  children: PropTypes.element,
  integrations: PropTypes.object,
  store: PropTypes.object,
}
