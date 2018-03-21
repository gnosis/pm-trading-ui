import { getTokenBalance } from 'api'
import { setConnectionStatus } from 'actions/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import { fetchTournamentUserData } from 'routes/Scoreboard/store/actions'
import { weiToEth, hexWithoutPrefix } from 'utils/helpers'
import { getTokenAddress } from 'utils/configuration'
import initUportConnector, { connect, connectorLogOut, isUserConnected } from './connector'

export const notificationsEnabled = false

class Uport extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.UPORT

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote ethereum host to be used as a last resort.
   */
  static providerPriority = 100
  static watcherInterval = 5000
  static USE_NOTIFICATIONS = notificationsEnabled

  constructor() {
    super()
    connect()
    this.watcher = setInterval(() => {
      this.watch('balance', this.getBalance)
      this.watch('network', this.getNetwork)
    }, Uport.watcherInterval)
  }

  /**
   * Tries to initialize and enable the current provider
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    super.initialize(opts)
    this.runProviderRegister(this, {
      priority: Uport.providerPriority,
      account: opts.uportDefaultAccount,
    })

    this.uport = await initUportConnector(Uport.USE_NOTIFICATIONS)
    this.web3 = await this.uport.getWeb3()
    this.provider = await this.uport.getProvider()
    this.network = await this.getNetwork()
    this.networkId = this.getNetworkId()
    this.account = null

    const userConnected = isUserConnected(this.uport)
    if (userConnected) {
      this.account = opts.uportDefaultAccount || (await this.getAccount())
    }

    return this.runProviderUpdate(this, {
      available: true,
      network: this.network,
      networkId: this.networkId,
      account: this.account,
    }).then(async () => {
      if (!userConnected) {
        opts.dispatch(setConnectionStatus({ connected: false }))
        return
      }
      await opts.initGnosis()
      opts.dispatch(fetchTournamentUserData(this.account))
    })
  }

  getNetworkId() {
    return hexWithoutPrefix(this.web3.currentProvider.networkId)
  }

  getAccount() {
    let accounts
    this.web3.eth.getAccounts((err, accountsArray) => {
      if (err) {
        console.error(err)
      }
      accounts = accountsArray
    })

    return accounts && accounts.length ? accounts[0] : null
  }

  /**
   * Returns the balance of olympia tokens for the current default account in Wei
   * @async
   * @param {string} account - Useraccount to get the balance for
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  async getBalance(account) {
    const userAccount = account || this.account
    const tokenAddress = getTokenAddress()
    if (!userAccount) {
      throw new Error('No Account available')
    }

    const balance = await getTokenBalance(tokenAddress, userAccount)

    if (typeof balance !== 'undefined') {
      return weiToEth(balance.toString())
    }

    throw new Error('Invalid Balance')
  }

  async logout() {
    await super.logout()
    connectorLogOut()
  }
}

export default new Uport()
