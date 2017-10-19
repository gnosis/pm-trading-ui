import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import { timeoutCondition } from 'utils/helpers'
import Web3 from 'web3'

const NETWORK_TIMEOUT = 10000

class Metamask extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.METAMASK

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 90

  /**
   * Tries to initialize and enable the current provider
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    super.initialize(opts)
    this.runProviderRegister(this, { priority: Metamask.providerPriority })

    this.walletEnabled = false

    try {
      if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider') {
        this.web3 = new Web3(window.web3.currentProvider)
        this.walletEnabled = true
      } else {
        this.walletEnabled = false
      }
    } catch (err) {
      this.walletEnabled = false
    }

    if (this.walletEnabled) {
      const checks = async () => {
        this.network = await this.getNetwork()
        this.account = await this.getAccount()
        this.balance = await this.getBalance()
      }

      // allow metamask timeout
      try {
        await Promise.race([checks(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
      } catch (err) {
        console.warn(err)
        this.walletEnabled = false
      }
    }

    return this.runProviderUpdate(this, {
      available: this.walletEnabled && this.account != null,
      network: this.network,
      account: this.account,
      balance: this.balance,
    })
  }
}

export default new Metamask()
