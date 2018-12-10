import { weiToEth, hexWithPrefix } from 'utils/helpers'
import Gnosis from '@gnosis.pm/pm-js/'
import * as api from 'api'

const zeroAccount = '0x0000000000000000000000000000000000000000'

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const gnosis = await api.getGnosisConnection()
  const account = await new Promise((resolve, reject) => gnosis.web3.eth.getAccounts(
    (e, accounts) => (e ? reject(e) : resolve(accounts[0])),
  ))
  return account
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account) => {
  const gnosis = await api.getGnosisConnection()
  const balanceValue = await new Promise((resolve, reject) => gnosis.web3.eth.getBalance(account,
    (e, balance) => (e ? reject(e) : resolve(weiToEth(balance.toString())))))
  return balanceValue
}

export const getMainnetAddressForRinkebyAccount = async (contractAddress, account) => {
  const gnosis = await api.getROGnosisConnection()
  const addressContract = await gnosis.contracts.AddressRegistry.at(contractAddress)
  const address = await addressContract.mainnetAddressFor(hexWithPrefix(account))

  return address === zeroAccount ? null : address
}

export const setMainnetAddressForRinkebyAccount = async (contractAddress, mainnetAddress) => {
  const gnosis = await api.getGnosisConnection()
  const addressContract = await gnosis.contracts.AddressRegistry.at(contractAddress)
  return Gnosis.requireEventFromTXResult(await addressContract.register(mainnetAddress), 'AddressRegistration')
}

export const signMessage = async (message) => {
  const gnosis = await api.getGnosisConnection()
  const account = await getCurrentAccount()

  const hashedMessage = (Buffer.from(message, 'utf8')).toString('hex')

  const signature = await new Promise((resolve, reject) => gnosis.web3.personal.sign(hashedMessage, account, 'no-password', (error, data) => {
    if (error) {
      return reject(error)
    }

    resolve(data)
  }))

  const r = gnosis.web3.toBigNumber(`0x${signature.slice(2, 66)}`)
  const s = gnosis.web3.toBigNumber(`0x${signature.slice(66, 130)}`)
  const v = gnosis.web3.toBigNumber(`0x${signature.slice(130, 132)}`)

  return {
    termsHash: gnosis.web3.sha3(`\x19Ethereum Signed Message:\n${message.length}${message}`),
    r: r.toString(10),
    s: s.toString(10),
    v: v.toString(10),
  }
}
