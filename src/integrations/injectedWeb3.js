import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS, WATCHABLE } from 'integrations/constants'
import { values } from 'lodash'

import { weiToEth, promisify } from 'utils/helpers'

class BaseIntegration {
  runProviderUpdate() {}
  runProviderRegister() {}

  /**
   *
   * @param {object} opts - Constructor Options
   * @param {string} opts.watchersEnabled - Array of watchable properties. Empty array disables watcher completely @see WATCHABLE
   * @param {number} opts.defaultTimeout - Time interval for watcher
   */
  constructor({ watchersEnabled = values(WATCHABLE), defaultTimeout = 1000 } = {}) {
    this.defaultTimeout = defaultTimeout
    this.watchersEnabled = watchersEnabled

    if (this.watchersEnabled.length > 0) {
      this.watcherInterval = setInterval(this.watcher, defaultTimeout)
    }
  }

  /**
   * Initializes the Integration
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    this.runProviderUpdate =
      typeof opts.runProviderUpdate === 'function' ? opts.runProviderUpdate : this.runProviderUpdate
    this.runProviderRegister =
      typeof opts.runProviderRegister === 'function' ? opts.runProviderRegister : this.runProviderRegister
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
    return await promisify(this.web3.version.getNetwork, [], this.defaultTimeout > 0 ? this.defaultTimeout : undefined)
  }

  /**
   * Returns the current Accounts Address
   * @async
   * @returns {Promise<string>} - Accountaddress
   */
  async getAccount() {
    const accounts = await promisify(
      this.web3.eth.getAccounts,
      [],
      this.defaultTimeout > 0 ? this.defaultTimeout : undefined,
    )

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

    const balance = await promisify(
      this.web3.eth.getBalance,
      [this.account],
      this.defaultTimeout > 0 ? this.defaultTimeout : undefined,
    )

    if (typeof balance !== 'undefined') {
      return weiToEth(balance.toString())
    }

    throw new Error('Invalid Balance')
  }

  /**
   * Periodic updater to get all relevant information from this provider
   * @async
   */

  watcher = async () => {
    try {
      if (this.watchersEnabled.indexOf(WATCHABLE.ACCOUNT) > -1) {
        const currentAccount = await this.getAccount()
        if (this.account !== currentAccount) {
          this.account = currentAccount
          await this.runProviderUpdate(this, { account: this.account })
        }
      }

      if (this.watchersEnabled.indexOf(WATCHABLE.NETWORK) > -1) {
        const currentNetworkId = await this.getNetworkId()
        if (this.networkId !== currentNetworkId) {
          this.networkId = currentNetworkId
          this.network = await this.getNetwork()
          await this.runProviderUpdate(this, { network: this.network, networkId: this.networkId })
        }
      }

      if (this.watchersEnabled.indexOf(WATCHABLE.BALANCE) > -1) {
        const currentBalance = await this.getBalance()
        if (this.balance !== currentBalance) {
          this.balance = currentBalance
          await this.runProviderUpdate(this, { balance: this.balance })
        }
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

export default BaseIntegration
