import { WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'
import InjectedWeb3 from 'integrations/injectedWeb3'
import Web3 from 'web3'

class Remote extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.REMOTE
  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 1

  /**
   * Tries to initialize and enable the current provider
   * @param {*} store - Redux Store
   * @see src/components/WalletIntegration/Provider - See for call signature
   */
  async initialize(store) {
    this.store = store

    this.store.dispatch(registerProvider({ provider: Remote.providerName }))
    this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))

    this.network = await this.getNetwork()
    this.account = await this.getAccount()

    await this.store.dispatch(updateProvider({
      provider: WALLET_PROVIDER.REMOTE,
      available: this.account !== undefined,
      network: this.network,
      account: this.account,
    }))

    // Remote connection is always available as long as there is a connection and web3 implemented
    this.walletEnabled = true

    return this.walletEnabled
  }
}
export default new Remote()
