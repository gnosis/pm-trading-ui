import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import Web3 from 'web3'

class Remote extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.REMOTE
  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 1
  static watcherInterval = 1000

  constructor() {
    super()

    this.watcher = () => {
      this.watch('account', this.getAccount)
      this.watch('balance', this.getBalance)
      this.watch('network', this.getNetwork)
    }
  }

  /**
   * Tries to set connection to the blockchain
   */
  async initWeb3() {
    try {
      this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))

      this.networkId = await this.getNetworkId()
      this.network = await this.getNetwork()

      return true
    } catch (err) {
      // remote not available
      return false
    }
  }

  /**
   * Tries to initialize and enable the current provider
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    super.initialize(opts)
    this.runProviderRegister(this, { priority: Remote.providerPriority })

    this.walletEnabled = await this.initWeb3()

    if (this.watcher) {
      setInterval(this.watcher, Remote.watcherInterval)
    }

    try {
      await this.runProviderUpdate(this, {
        available: this.walletEnabled && this.account != null,
        networkId: this.networkId,
        network: this.network,
        account: this.account,
        balance: this.balance,
      })
    } finally {
      opts.initGnosis()
    }
  }
}
export default new Remote()
