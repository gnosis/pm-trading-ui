import * as api from './'

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const gnosis = await api.getGnosisConnection()
  const account = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getAccounts((e, accounts) => (e ? reject(e) : resolve(accounts[0]))))
  return account
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account) => {
  const gnosis = await api.getGnosisConnection()
  const balanceValue = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getBalance(account, (e, balance) => (e ? reject(e) : resolve(weiToEth(balance.toString())))))
  return balanceValue
}

/**
 * Returns the amount of ether tokens
 * @param {*string} account address
 */
export const getEtherTokens = async (account) => {
  const gnosis = await api.getGnosisConnection()

  if (gnosis && gnosis.etherToken) {
    const balance = await gnosis.etherToken.balanceOf(account) // balance is a BigNumber
    return new Decimal(balance.toFixed(0))
  }
  return undefined
}

export const getOlympiaTokensByAccount = async (account) => {
  const gnosis = await api.getGnosisConnection()
  const balance = await gnosis.olympiaToken.balanceOf(account)
  return new Decimal(balance.toFixed(0)).toString()
}

export const getMainnetAddressForRinkebyAccount = async (account) => {
  const gnosis = await api.getGnosisConnection()
  const address = await gnosis.olympiaAddressRegistry.mainnetAddressFor(hexWithPrefix(account))

  return address
}

export const setMainnetAddressForRinkebyAccount = async (mainnetAddress) => {
  const gnosis = await api.getGnosisConnection()
  return Gnosis.requireEventFromTXResult(
    await gnosis.olympiaAddressRegistry.register(mainnetAddress),
    'AddressRegistration',
  )
}
