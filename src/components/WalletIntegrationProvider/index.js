import { Component } from 'react'
import PropTypes from 'prop-types'
import { connectBlockchain, initGnosis, setActiveProvider } from 'actions/blockchain'
import { findDefaultProvider } from 'selectors/blockchain'
import { getGnosisJsOptions } from 'utils/helpers'


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
      const opts = getGnosisJsOptions(defaultProvider)
      // init Gnosis connection
      await reactStore.dispatch(initGnosis(opts))

      await reactStore.dispatch(connectBlockchain())
    }

    window.addEventListener('load', () => init(Object.keys(integrations), store))
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
