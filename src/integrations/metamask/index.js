import _ from 'lodash'

import { ETHEREUM_NETWORKS, WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'

class Metamask {
  async initialize(store) {
    this.store = store
    this.store.dispatch(registerProvider({ provider: WALLET_PROVIDER.METAMASK }))

    const walletEnabled = await new Promise((resolve) => {
      /* global Web3, window */
      window.addEventListener('load', () => {
        if (typeof window.web3 !== 'undefined') {
          this.web3 = new Web3(window.web3.currentProvider)
          return resolve(true)
        }

        return resolve(false)
      })
    })

    let account
    let network

    if (walletEnabled) {
      network = await this.getNetwork()
      account = await this.getAccount()
    }

    this.store.dispatch(updateProvider({
      provider: WALLET_PROVIDER.METAMASK,
      available: walletEnabled && account,
      network,
      account,
    }))
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
}

export default new Metamask()
