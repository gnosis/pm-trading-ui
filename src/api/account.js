import { weiToEth, hexWithPrefix } from 'utils/helpers'
import Gnosis from '@gnosis.pm/gnosisjs/'
import * as api from 'api'

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
