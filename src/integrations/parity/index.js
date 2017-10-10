import { WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'
import InjectedWeb3 from 'integrations/injectedWeb3'
import Web3 from 'web3'

class Parity extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.PARITY

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 100

  /**
   * Tries to initialize and enable the current provider
   * @param {*} store - Redux Store
   * @see src/components/WalletIntegration/Provider - See for call signature
   */
  async initialize(store) {
    this.store = store
    this.store.dispatch(registerProvider({ provider: Parity.providerName, priority: Parity.providerPriority }))

    this.walletEnabled = false

    if (typeof window.web3 !== 'undefined' && window.web3.parity) {
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
      provider: Parity.providerName,
      available: this.walletEnabled && this.account !== undefined,
      network: this.network,
      account: this.account,
    }))

    return this.walletEnabled
  }
}
export default new Parity()
