import autobind from 'autobind-decorator'
import { ETHEREUM_NETWORK } from 'integrations/constants'

import { weiToEth } from 'utils/helpers'

class InjectedWeb3 {
  runProviderUpdate() {}
  runProviderRegister() {}

  constructor() {
    this.watcherInterval = setInterval(this.watcher, 1000)
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
   * @returns {Promise<string>} - Network Identifier
   */
  async getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
        if (err) {
          reject(err)
        } else {
          switch (netId) {
            case '1': {
              resolve(ETHEREUM_NETWORK.MAIN)
              break
            }
            case '2': {
              resolve(ETHEREUM_NETWORK.MORDEN)
              break
            }
            case '3': {
              resolve(ETHEREUM_NETWORK.ROPSTEN)
              break
            }
            case '4': {
              resolve(ETHEREUM_NETWORK.RINKEBY)
              break
            }
            case '42': {
              resolve(ETHEREUM_NETWORK.KOVAN)
              break
            }
            default: {
              resolve(ETHEREUM_NETWORK.UNKNOWN)
              break
            }
          }
        }
      })
    })
  }

  /**
   * Returns the current Accounts Address
   * @async
   * @returns {Promise<string>} - Accountaddress
   */
  async getAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(
        (e, accounts) => {
          if (e) {
            reject(e)
          }
          resolve(accounts && accounts.length ? accounts[0] : null)
        },
      )
    })
  }

  /**
   * Returns the balance for the current default account in Wei
   * @async
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  async getBalance() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(
        this.account,
        (e, balance) => (e ? reject(e) : resolve(weiToEth(balance.toString()))),
      )
    })
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

      const currentNetwork = await this.getNetwork()
      if (this.network !== currentNetwork) {
        this.network = currentNetwork
        await this.runProviderUpdate(this, { network: this.network })
      }

      const currentBalance = await this.getBalance()
      if (this.balance !== currentBalance) {
        this.balance = currentBalance
        await this.runProviderUpdate(this, { balance: this.balance })
      }

      if (!this.walletEnabled && currentAccount) {
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
