import { WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'
import InjectedWeb3 from 'integrations/injectedWeb3'
import Web3 from 'web3'

class Metamask extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.METAMASK

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 90

  /**
   * Tries to initialize and enable the current provider
   * @param {*} store - Redux Store
   * @see src/components/WalletIntegration/Provider - See for call signature
   */
  async initialize(store) {
    this.store = store
    this.store.dispatch(registerProvider({ provider: Metamask.providerName, priority: Metamask.providerPriority }))

    this.walletEnabled = false
    
    if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider') {
      this.web3 = new Web3(window.web3.currentProvider)
      this.walletEnabled = true
    } else {
      this.walletEnabled = false
    }

    if (this.walletEnabled) {
      this.network = await this.getNetwork()
      this.account = await this.getAccount()
    }

    await this.store.dispatch(updateProvider({
      provider: Metamask.providerName,
      available: this.walletEnabled && this.account !== undefined,
      network: this.network,
      account: this.account,
    }))
    
    return this.walletEnabled
  }
}

export default new Metamask()
