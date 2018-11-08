import { setConnectionStatus } from 'store/actions/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import { fetchTournamentUserData } from 'routes/Scoreboard/store/actions'
import { hexWithoutPrefix } from 'utils/helpers'
import { getProviderIntegrationConfig } from 'utils/features'
import initUportConnector, { connect, connectorLogOut, isUserConnected } from './connector'

export const { notificationsEnabled = false } = getProviderIntegrationConfig('uport')

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

  checkIfInstalled() {
    return true
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
    return +hexWithoutPrefix(this.web3.currentProvider.networkId)
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

  async logout() {
    await super.logout()
    connectorLogOut()
  }
}

export default new Uport()
