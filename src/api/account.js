import { weiToEth, hexWithPrefix } from 'utils/helpers'
import Gnosis from '@gnosis.pm/gnosisjs/'
import * as api from 'api'

const zeroAccount = '0x0000000000000000000000000000000000000000'

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

export const getMainnetAddressForRinkebyAccount = async (contractAddress, account) => {
  const gnosis = await api.getGnosisConnection()
  const addressContract = await gnosis.contracts.AddressRegistry.at(contractAddress)
  const address = await addressContract.mainnetAddressFor(hexWithPrefix(account))

  return address === zeroAccount ? undefined : address
}

export const setMainnetAddressForRinkebyAccount = async (mainnetAddress) => {
  const gnosis = await api.getGnosisConnection()
  return Gnosis.requireEventFromTXResult(
    await gnosis.olympiaAddressRegistry.register(mainnetAddress),
    'AddressRegistration',
  )
}
