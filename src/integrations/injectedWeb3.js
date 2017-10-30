import autobind from 'autobind-decorator'
import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS } from 'integrations/constants'

import { weiToEth, promisify } from 'utils/helpers'

class InjectedWeb3 {
  runProviderUpdate() {}
  runProviderRegister() {}

  constructor(enableWatcher = true) {
    if (enableWatcher) {
      this.watcherInterval = setInterval(this.watcher, 1000)
    }
  }

  /**
   * Initializes the Integration
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    this.runProviderUpdate = typeof opts.runProviderUpdate === 'function' ? opts.runProviderUpdate : this.runProviderUpdate
    this.runProviderRegister = typeof opts.runProviderRegister === 'function' ? opts.runProviderRegister : this.runProviderRegister
  }

  /**
   * Returns the current Networks Name
   * @async
   * @see src/integrations/constants ETHEREUM_NETWORK constants
   * @returns {Promise<string>} - Network Name Constant
   */
  async getNetwork() {
    const networkId = await this.getNetworkId()

    const networkName = ETHEREUM_NETWORK_IDS[networkId]
    return networkName || ETHEREUM_NETWORK.UNKNOWN
  }

  /**
   * Returns the current Networks ID
   * @async
   * @returns {Promise<string>} - Network Identifier
   */
  async getNetworkId() {
    return await promisify(this.web3.version.getNetwork, [], 10000)
  }

  /**
   * Returns the current Accounts Address
   * @async
   * @returns {Promise<string>} - Accountaddress
   */
  async getAccount() {
    const accounts = await promisify(this.web3.eth.getAccounts, [], 10000)

    return accounts && accounts.length ? accounts[0] : null
  }

  /**
   * Returns the balance for the current default account in Wei
   * @async
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  async getBalance() {
    if (!this.account) {
      throw new Error('No Account available')
    }

    const balance = await promisify(this.web3.eth.getBalance, [this.account], 10000)

    if (typeof balance !== 'undefined') {
      return weiToEth(balance.toString())
    }

    throw new Error('Invalid Balance')
  }

  /**
   * Periodic updater to get all relevant information from this provider
   * @async
   */
  @autobind
  async watcher() {
    try {
      const currentAccount = await this.getAccount()
      if (this.account !== currentAccount) {
        this.account = currentAccount
        await this.runProviderUpdate(this, { account: this.account })
      }

      const currentNetworkId = await this.getNetworkId()
      if (this.networkId !== currentNetworkId) {
        this.networkId = currentNetworkId
        this.network = await this.getNetwork()
        await this.runProviderUpdate(this, { network: this.network, networkId: this.networkId })
      }

      const currentBalance = await this.getBalance()
      if (this.balance !== currentBalance) {
        this.balance = currentBalance
        await this.runProviderUpdate(this, { balance: this.balance })
      }

      if (!this.walletEnabled && this.account) {
        this.walletEnabled = true
        await this.runProviderUpdate(this, { available: true })
      }
    } catch (err) {
      if (this.walletEnabled) {
        this.walletEnabled = false
        await this.runProviderUpdate(this, { available: false })
      }
    }
  }

}

export default InjectedWeb3
