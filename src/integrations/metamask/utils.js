export const hasMetamask = () =>
  typeof window.web3 !== 'undefined' &&
  (window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider' || window.web3.currentProvider.isMetaMask)

const promisify = (func, params, timeout) =>
  new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => reject(new Error('Promise timed out')), timeout)
    }

    func(...params, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })

export const isMetamaskUnlocked = async () => {
  let isUnlocked = false

  if (hasMetamask()) {
    const accounts = await promisify(window.web3.eth.getAccounts, [], 0)
    if (accounts.length > 0) {
      isUnlocked = true
    }
  }
  return isUnlocked
}

export const isOnWrongNetwork = async (desiredNetworkId) => {
  let wrongNetwork = true

  if (hasMetamask()) {
    const networkId = await promisify(window.web3.version.getNetwork, [], 0)

    if (desiredNetworkId === +networkId) {
      wrongNetwork = false
    }
  }

  return wrongNetwork
}
