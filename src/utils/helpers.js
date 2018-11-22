import { startsWith, isArray, range } from 'lodash'
import seedrandom from 'seedrandom'
import Decimal from 'decimal.js'
import { HEX_VALUE_REGEX, OUTCOME_TYPES, REQUEST_STATES } from 'utils/constants'
import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'
import { getConfiguration } from 'utils/features'

import dictionary from 'assets/randomNames.json'

const config = getConfiguration()

const ethereumUrl = `${config.ethereum.protocol}://${config.ethereum.host}`

/**
 * Adds the `0x` prefix to the incoming string value
 * @param {String} value
 */
export const add0xPrefix = value => (startsWith(value, '0x') ? value : `0x${value}`)

export const hexWithPrefix = value => (HEX_VALUE_REGEX.test(value) ? add0xPrefix(value) : value)

export const hexWithoutPrefix = value => (startsWith(value, '0x') ? value.substring(2) : value)

export const normalizeHex = value => hexWithPrefix(value).toLowerCase()

/**
 * Converts a value from WEI to ETH
 * @param {String|Number|Decimal} value
 */
export const weiToEth = (value) => {
  let ethValue = new Decimal(0)

  if (typeof value === 'string') {
    ethValue = new Decimal(value)
    if (ethValue.gt(0)) {
      return ethValue.div(1e18).toString()
    }
    return new Decimal(0).div(1e18).toString()
  }
  if (typeof value === 'object' && value.gt && value.gt(0)) {
    return value.div(1e18).toString()
  }

  return ethValue.toString()
}

export const getOutcomeName = (market, index) => {
  let outcomeName
  if (!market.outcomes) {
    return null
  }

  if (market.type === OUTCOME_TYPES.CATEGORICAL) {
    outcomeName = market.outcomes.get(index).name
  } else if (market.type === OUTCOME_TYPES.SCALAR) {
    outcomeName = index === 0 ? 'Short' : 'Long'
  }
  return outcomeName
}

export const normalizeScalarPoint = (marginalPrices, { bounds: { lower, upper, decimals } }) => {
  const bigDecimals = parseInt(decimals, 10)

  const bigUpperBound = Decimal(upper).div(10 ** bigDecimals)
  const bigLowerBound = Decimal(lower).div(10 ** bigDecimals)

  const bounds = bigUpperBound.sub(bigLowerBound)
  return Decimal(marginalPrices[1].toString())
    .times(bounds)
    .add(bigLowerBound)
    .toDP(decimals)
    .toNumber()
}

export const restFetch = url => fetch(url)
  .then(res => new Promise((resolve, reject) => (res.status >= 400 ? reject(res.statusText) : resolve(res))))
  .then(res => res.json())
  .catch(
    err => new Promise((resolve, reject) => {
      console.warn(`Gnosis DB: ${err}`)
      reject(err)
    }),
  )

export const timeoutCondition = (timeout, rejectReason) => new Promise((_, reject) => {
  setTimeout(() => {
    reject(rejectReason)
  }, timeout)
})

/**
 * Determines if an account is a Moderator
 * @param {*string} accountAddress
 */
export const isModerator = accountAddress => (Object.keys(config.whitelist).length ? config.whitelist[accountAddress] !== undefined : false)

export const getModerators = () => config.whitelist

export const getGnosisJsOptions = (provider) => {
  const opts = {}
  if (provider && provider.name === WALLET_PROVIDER.METAMASK) {
    // Inject window.web3
    opts.ethereum = window.web3.currentProvider
  } else if (provider && provider === WALLET_PROVIDER.PARITY) {
    // Inject window.web3
    opts.ethereum = window.web3.currentProvider
  } else if (provider && provider.name === WALLET_PROVIDER.UPORT) {
    // eslint-disable-next-line
    const { uport } = require('integrations/uport')
    opts.ethereum = uport.getProvider()
    opts.defaultAccount = provider.account
  } else {
    // Default remote node
    opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${ethereumUrl}`)).currentProvider
  }
  opts.logger = 'console'

  return opts
}

const BLOCKED_WORD_LIST = ['sexual', 'african', 'american', 'european', 'asian', 'israeli', 'jewish', 'arab', 'christian', 'slave', 'russian']

export const generateDeterministicRandomName = (seed) => {
  const rng = seedrandom(seed.toLowerCase(), { state: true })

  // generate 5 so later we have more params left over for longer names, without changing everyone's other words
  // eslint-disable-next-line no-unsued-vars
  const [r1, r2] = range(0, 5).map(rng)

  const { adjectives, nouns } = dictionary

  let adjectiveIndex = Math.floor(r1 * adjectives.length)
  let nounIndex = Math.floor(r2 * nouns.length)

  let adjective = adjectives[adjectiveIndex]
  let noun = nouns[nounIndex]

  while (BLOCKED_WORD_LIST.indexOf(adjective) > -1) {
    adjective = adjectives[adjectiveIndex]
    adjectiveIndex = (adjectiveIndex + 1) % (adjectives.length - 1)
  }

  while (BLOCKED_WORD_LIST.indexOf(noun) > -1) {
    noun = nouns[nounIndex]
    nounIndex = (nounIndex + 1) % (nounIndex.length - 1)
  }

  return `${adjective} ${noun}`
}

export const generateWalletName = (account) => {
  const accountAddressNormalized = hexWithPrefix(account).toLowerCase()

  return generateDeterministicRandomName(accountAddressNormalized)
}

export const setRequestStateWrap = async (setRequestState, asyncAction, context, ...params) => {
  setRequestState(REQUEST_STATES.LOADING)
  try {
    await asyncAction.apply(context, params)
    setRequestState(REQUEST_STATES.SUCCESS)
  } catch (e) {
    console.error(e)
    setRequestState(REQUEST_STATES.ERROR)
  }
}
