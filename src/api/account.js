import { weiToEth, hexWithPrefix } from 'utils/helpers'
import Gnosis from '@gnosis.pm/pm-js/'
import * as api from 'api'
import Web3 from 'web3'

const web3 = new Web3()

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

export const signMessage = async (rawMessage) => {
  const gnosis = await api.getGnosisConnection()
  const account = await getCurrentAccount()

  const message = rawMessage.replace(/[\u00A0-\u9999<>\&]/gim, i => `\\${i.charCodeAt(0)}`)

  web3.setProvider(gnosis.web3.currentProvider)
  const signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(message), account, 'no-password')

  const r = gnosis.web3.toBigNumber(`0x${signature.slice(2, 66)}`)
  const s = gnosis.web3.toBigNumber(`0x${signature.slice(66, 130)}`)
  const v = gnosis.web3.toBigNumber(`0x${signature.slice(130, 132)}`)

  /*
  const validation = web3.eth.accounts.recover({
    messageHash: web3.utils.sha3(`\x19Ethereum Signed Message:\n${message.length}${message}`),
    r: `0x${signature.slice(2, 66)}`,
    s: `0x${signature.slice(66, 130)}`,
    v: `0x${signature.slice(130, 132)}`,
  })

  if (validation.toLowerCase() !== account.toLowerCase()) {
    console.log(`GOT ACCOUNT: ${validation}`)
    console.log(`EXPECTED: ${account}`)
    throw new Error('invalid account recovered')
  }
  console.log('Successfully recovered')
  */

  return {
    termsHash: gnosis.web3.sha3(`\x19Ethereum Signed Message:\n${message.length}${message}`),
    r: r.toString(10),
    s: s.toString(10),
    v: v.toString(10),
  }
}

window.signMessage = signMessage
