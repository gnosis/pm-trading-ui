import { getOlympiaTokensByAccount } from 'api'
import { WALLET_PROVIDER, WATCHABLE } from 'integrations/constants'
import BaseIntegration from 'integrations/baseIntegration'
import { fetchOlympiaUserData } from 'routes/scoreboard/store/actions'
import { weiToEth } from 'utils/helpers'
import uPortInstance, { hasValidCredential, requestCredentials, getCredentialsFromLocalStorage } from './connector'

class Uport extends BaseIntegration {
  static providerName = WALLET_PROVIDER.UPORT

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote ethereum host to be used as a last resort.
   */
  static providerPriority = 100
  static watchersEnabled = [WATCHABLE.BALANCE, WATCHABLE.NETWORK]
  static watcherTimeout = 5000

  constructor() {
    const { watchersEnabled, watcherTimeout } = Uport
    super({ watchersEnabled, watcherTimeout })
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

    this.uport = uPortInstance

    if (!hasValidCredential()) {
      await requestCredentials()
    }

    this.web3 = await this.uport.getWeb3()
    this.provider = await this.uport.getProvider()
    this.network = await this.getNetwork()
    this.networkId = await this.getNetworkId()

    const cred = getCredentialsFromLocalStorage()

    if (cred) {
      this.uport.address = cred.address
      this.uport.pushToken = cred.pushToken
      this.uport.publicEncKey = cred.publicEncKey
      this.account = opts.uportDefaultAccount || (await this.getAccount())
    }

    return this.runProviderUpdate(this, {
      available: true,
      network: this.network,
      networkId: this.networkId,
      account: this.account,
    })
      .then(async () => {
        if (!this.account) {
          return
        }
        await opts.initGnosis()
        const balance = await getOlympiaTokensByAccount(this.account)
        opts.runProviderUpdate(this, {
          provider: Uport.providerName,
          balance: weiToEth(balance),
          account: this.account,
        })
        opts.dispatch(fetchOlympiaUserData(this.account))
      })
      .catch(() => opts.initGnosis())
  }
}

export default new Uport()
