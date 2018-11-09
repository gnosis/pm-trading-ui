import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS, WALLET_STATUS } from 'integrations/constants'

import { weiToEth } from 'utils/helpers'

class InjectedWeb3 {
  /**
   * Handles updates of the current integrations, passed during initialization.
   * @virtual
   * @param {function} instance - Instance of the current provider, used to determine name of changes provider and various class properties
   * @param {object} data - Data to update in wallets redux-store in `store.integrations.providers[PROVIDER_NAME]`
   */
  runProviderUpdate() {}

  /**
   * Handles registering the integration in the redux-store and thus the interface.
   * @virtual
   * @param {function} instance - Instance of the current provider, used to determine name of changes provider and various class properties
   * @param {object} data - Data to write in this providers redux store. Usually includes provider priority
   */
  runProviderRegister() {}

  /**
   * Checks if provider is available and can be used to login
   * @virtual
   */
  checkAvailability({ runProviderRegister, runProviderUpdate }) {
    runProviderRegister(this)

    const providerInstalled = this.checkIfInstalled()
    const status = providerInstalled ? WALLET_STATUS.READY_TO_INIT : WALLET_STATUS.NOT_INSTALLED

    return runProviderUpdate({ provider: this.constructor.providerName, status })
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
    const networkId = await this.web3.eth.net.getId()
    return networkId
  }

  /**
   * Returns the current Accounts Address
   * @async
   * @returns {Promise<string>} - Accountaddress
   */
  async getAccount() {
    const accounts = await this.web3.eth.getAccounts()

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

    const balance = await this.web3.eth.getBalance(this.account)

    if (typeof balance !== 'undefined') {
      return weiToEth(balance.toString())
    }

    throw new Error('Invalid Balance')
  }

  /**
   * Add a new watcher to a property inside the integration
   * @param {string} property - Property inside the integration that is holding the value for this watcher
   * @param {function} getter - (async) function that returns the value for the watcher
   * @async
   */
  watch = async (property, getter) => {
    let value

    try {
      value = await getter.call(this)
    } catch (e) {
      if (this.walletEnabled) {
        this.walletEnabled = false
        this[property] = undefined
        await this.runProviderUpdate(this, { status: WALLET_STATUS.ERROR, [property]: undefined })
      }

      return
    }

    const didPropertyChange = this[property] !== value
    if (!didPropertyChange) {
      return
    }

    const providerUpdate = { [property]: value }

    if (!this.walletEnabled) {
      this.walletEnabled = true
    }

    this[property] = value

    this.runProviderUpdate(this, providerUpdate)
  }

  /**
   * Clears this provider of all data, updating the store with the changes properties
   * @async
   */
  async logout() {
    this.balance = undefined
    this.network = undefined
    this.account = undefined
    this.walletEnabled = false

    await this.runProviderUpdate(this, {
      account: undefined,
      balance: undefined,
      network: undefined,
      status: WALLET_STATUS.READY_TO_INIT,
    })
  }
}

export default InjectedWeb3
