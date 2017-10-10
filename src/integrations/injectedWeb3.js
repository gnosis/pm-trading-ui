import autobind from 'autobind-decorator'
import { ETHEREUM_NETWORKS } from 'integrations/constants'

import {
  getGnosisJsOptions
} from 'utils/helpers'

import {
  getCurrentBalance,
} from 'api'

import {
  initGnosis,
  updateProvider,
  setActiveProvider,
} from 'actions/blockchain'

import {
  findDefaultProvider,
} from 'selectors/blockchain'

class InjectedWeb3 {
  constructor() {
    this.watcherInterval = setInterval(this.watcher, 1000)
  }

  async getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
        if (err) {
          reject(err)
        } else {
          switch (netId) {
            case '1': {
              resolve(ETHEREUM_NETWORKS.MAIN)
              break
            }
            case '2': {
              resolve(ETHEREUM_NETWORKS.MORDEN)
              break
            }
            case '3': {
              resolve(ETHEREUM_NETWORKS.ROPSTEN)
              break
            }
            case '4': {
              resolve(ETHEREUM_NETWORKS.RINKEBY)
              break
            }
            case '42': {
              resolve(ETHEREUM_NETWORKS.KOVAN)
              break
            }
            default: {
              resolve(ETHEREUM_NETWORKS.UNKNOWN)
              break
            }
          }
        }
      })
    })
  }

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

  async getBalance() {
    return getCurrentBalance(this.account)
  }

  async updateActiveProvider() {
    // determine new provider
    const newProvider = findDefaultProvider(this.store.getState())
    await this.store.dispatch(setActiveProvider(newProvider.name))

    // get Gnosis options
    const opts = getGnosisJsOptions(newProvider.name)   
    // init Gnosis connection
    await this.store.dispatch(initGnosis(opts))
  }

  async handleDisconnect(err) {
    this.walletEnabled = false
    console.log(`WalletProvider ${this.constructor.providerName}: Has lost connection (${err})`)

    await this.store.dispatch(updateProvider({ provider: this.constructor.providerName, available: false }))
    return this.updateActiveProvider()
  }

  async handleConnect() {
    this.walletEnabled = true
    console.log(`WalletProvider ${this.constructor.providerName}: Connected`)

    await this.store.dispatch(updateProvider({ provider: this.constructor.providerName, available: true }))
    return this.updateActiveProvider()

  }

  async handleNetworkChange(newNetwork) {
    this.network = newNetwork
    console.log(`WalletProvider ${this.constructor.providerName}: Changed Network`)

    this.store.dispatch(updateProvider({ provider: this.constructor.providerName, network: newNetwork }))
    return this.updateActiveProvider()
  }

  async handleBalanceChange(newBalance) {
    this.balance = newBalance

    this.store.dispatch(updateProvider({ provider: this.constructor.providerName, balance: newBalance }))
  }

  async handleAccountChange(newAccount) {
    this.account = newAccount
    console.log(`WalletProvider ${this.constructor.providerName}: Changed Account`)

    this.store.dispatch(updateProvider({ provider: this.constructor.providerName, account: newAccount }))
  }

  @autobind
  async watcher() {
    try {
      const currentAccount = await this.getAccount()
      if (this.account !== currentAccount) {
        await this.handleAccountChange(currentAccount)
      }

      const currentNetwork = await this.getNetwork()
      if (this.network !== currentNetwork) {
        await this.handleNetworkChange(currentNetwork)
      }

      const currentBalance = await this.getBalance()
      if (this.balance !== currentBalance) {
        await this.handleBalanceChange(currentBalance)
      }

      if (!this.walletEnabled && currentAccount) {
        await this.handleConnect()
      }
    } catch (err) {
      if (this.walletEnabled) {
        await this.handleDisconnect(err)
      }
    }
  }

}

export default InjectedWeb3
