import { getOlympiaTokensByAccount } from 'api'
import { setConnectionStatus } from 'actions/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import BaseIntegration from 'integrations/baseIntegration'
import { fetchOlympiaUserData } from 'routes/scoreboard/store/actions'
import { weiToEth } from 'utils/helpers'
import initUportConnector, { isUserConnected } from './connector'

class Uport extends BaseIntegration {
  static providerName = WALLET_PROVIDER.UPORT

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote ethereum host to be used as a last resort.
   */
  static providerPriority = 100
  static watcherInterval = 5000
  static USE_NOTIFICATIONS = false

  constructor() {
    super()

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
    this.networkId = await this.getNetworkId()
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
    })
      .then(async () => {
        if (!userConnected) {
          opts.dispatch(setConnectionStatus({ connected: false }))
          return
        }
        await opts.initGnosis()
        opts.dispatch(fetchOlympiaUserData(this.account))
      })
  }

  /**
   * Returns the balance of olympia tokens for the current default account in Wei
   * @async
   * @param {string} account - Useraccount to get the balance for
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  async getBalance(account) {
    const userAccount = account || this.account
    if (!userAccount) {
      throw new Error('No Account available')
    }

    const balance = await getOlympiaTokensByAccount(userAccount)

    if (typeof balance !== 'undefined') {
      return weiToEth(balance.toString())
    }

    throw new Error('Invalid Balance')
  }
}

export default new Uport()
