import _ from 'lodash'

import { ETHERIUM_NETWORKS } from 'integrations/constants'

export default class Metamask {
  constructor(web3) {
    this.web3 = web3
  }

  getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
        if (err) {
          reject(err)
        } else {
          switch (netId) {
            case '1': {
              resolve(ETHERIUM_NETWORKS.MAIN)
              break
            }
            case '2': {
              resolve(ETHERIUM_NETWORKS.MORDEN)
              break
            }
            case '3': {
              resolve(ETHERIUM_NETWORKS.ROPSTEN)
              break
            }
            case '4': {
              resolve(ETHERIUM_NETWORKS.RINKEBY)
              break
            }
            default: {
              resolve(ETHERIUM_NETWORKS.UNKNOWN)
              break
            }
          }
        }
      })
    })
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      const accounts = _.get(this, 'web3.eth.accounts', [])
      if (accounts.length > 0) {
        resolve(accounts[0])
      } else {
        reject('No Accounts available')
      }
    })
  }
}
