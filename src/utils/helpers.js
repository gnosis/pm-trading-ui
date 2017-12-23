/* globals fetch */

import { mapValues, startsWith, isArray, range } from 'lodash'
import seedrandom from 'seedrandom'
import Decimal from 'decimal.js'
import moment from 'moment'
import { HEX_VALUE_REGEX, OUTCOME_TYPES, MARKET_STAGES } from 'utils/constants'
import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'
import Uport from 'integrations/uport'

import dictionary from 'randomNames.json'

export const hexWithoutPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return startsWith(value, '0x') ? value.substring(2) : value
  }

  return value
}

/**
 * Adds the `0x` prefix to the incoming string value
 * @param {String} value
 */
export const add0xPrefix = value => (startsWith(value, '0x') ? value : `0x${value}`)

export const hexWithPrefix = value => (HEX_VALUE_REGEX.test(value) ? add0xPrefix(value) : value)

export const isMarketResolved = ({ oracle: { isOutcomeSet } }) => isOutcomeSet

export const isMarketClosed = ({ stage, eventDescription: { resolutionDate } }) =>
  stage === MARKET_STAGES.MARKET_CLOSED || moment(resolutionDate).isBefore(moment().utc())

export const toEntity = (data, entityType, idKey = 'address') => {
  const { [idKey]: id, ...entityPayload } = mapValues(data, hexWithoutPrefix)

  return {
    entities: {
      [entityType]: {
        [id]: {
          [idKey]: id,
          ...entityPayload,
        },
      },
    },
    result: [id],
  }
}

/**
 * Converts a value from WEI to ETH
 * @param {String|Number} value
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
  if (!market.event) {
    return null
  }
  if (market.event.type === OUTCOME_TYPES.CATEGORICAL) {
    outcomeName = market.eventDescription.outcomes[index]
  } else if (market.event.type === OUTCOME_TYPES.SCALAR) {
    outcomeName = index === 0 ? 'Short' : 'Long'
  }
  return outcomeName
}

export const normalizeScalarPoint = (
  marginalPrices,
  { event: { lowerBound, upperBound }, eventDescription: { decimals } },
) => {
  const bigDecimals = parseInt(decimals, 10)

  const bigUpperBound = Decimal(upperBound).div(10 ** bigDecimals)
  const bigLowerBound = Decimal(lowerBound).div(10 ** bigDecimals)

  const bounds = bigUpperBound.sub(bigLowerBound)
  return Decimal(marginalPrices[1].toString())
    .times(bounds)
    .add(bigLowerBound)
    .toDP(decimals)
    .toNumber()
}

/**
 * Adds _id incremental numeric property to each object in the array
 * @param { objects[] } arrayData
 */
export const addIdToObjectsInArray = (arrayData) => {
  arrayData.forEach((item, index) => {
    item._id = index
  })
  return arrayData
}

export const restFetch = url =>
  fetch(url)
    .then(res => new Promise((resolve, reject) => (res.status >= 400 ? reject(res.statusText) : resolve(res))))
    .then(res => res.json())
    .catch(err =>
      new Promise((resolve, reject) => {
        console.warn(`Gnosis DB: ${err}`)
        reject(err)
      }))

export const bemifyClassName = (className, element, modifier) => {
  const classNameDefined = className || ''
  const classNames = isArray(classNameDefined) ? classNameDefined : classNameDefined.split(' ')

  if (classNames && classNames.length) {
    let classPath = ''

    if (element) {
      classPath += `__${element}`
    }
    if (element && modifier) {
      classPath += `--${modifier}`
    }

    return classNames
      .filter(s => s.length)
      .map(cls => `${cls}${classPath}`)
      .join(' ')
  }

  return ''
}

export const timeoutCondition = (timeout, rejectReason) =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(rejectReason)
    }, timeout)
  })

/**
 * Determines if an account is a Moderator
 * @param {*string} accountAddress
 */
export const isModerator = accountAddress =>
  (Object.keys(process.env.WHITELIST).length ? process.env.WHITELIST[accountAddress] !== undefined : false)

export const getModerators = () => process.env.WHITELIST

export const getGnosisJsOptions = (provider) => {
  const opts = {}
  if (provider && provider.name === WALLET_PROVIDER.METAMASK) {
    // Inject window.web3
    opts.ethereum = window.web3.currentProvider
  } else if (provider && provider === WALLET_PROVIDER.PARITY) {
    // Inject window.web3
    opts.ethereum = window.web3.currentProvider
  } else if (provider && provider.name === WALLET_PROVIDER.UPORT) {
    const { uport } = Uport
    opts.ethereum = uport.getProvider()
    opts.defaultAccount = provider.account
  } else {
    // Default remote node
    opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`)).currentProvider
  }

  return opts
}

export const promisify = (func, params, timeout) =>
  new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => reject('Promise timed out'), timeout)
    }

    func(...params, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })

const BLOCKED_WORD_LIST = ['sexual', 'african', 'american', 'european', 'asian', 'israeli']

export const generateDeterministicRandomName = (seed) => {
  const rng = seedrandom(seed.toLowerCase(), { state: true })

  // generate 5 so later we have more params left over for longer names, without changing everyone's other words
  // eslint-disable-next-line no-unsued-vars
  const [r1, r2, ...params] = range(0, 5).map(rng)

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

const isValidMarket = market =>
  !!(market &&
  market.event &&
  market.oracle &&
  market.eventDescription)

const marketCanRedeemWinnings = market => market.event.isWinningOutcomeSet

const SCALAR_OUTCOME_RANGE = 1000000

export const getMarketWinningsCategorical = (market, shares, account) => {
  if (!isValidMarket(market) || !marketCanRedeemWinnings(market)) {
    return {}
  }

  const marketOutcome = parseInt(market.event.outcome, 10)

  // let winnings = Decimal(0)
  const winningsByOutcome = {}

  shares.forEach((share) => {
    const shareOutcome = parseInt(share.outcomeToken.index, 10)
    const belongsToMarket = share.outcomeToken.event === market.event.address
    const belongsToUser = share.owner === account
    const outcomeWon = shareOutcome === marketOutcome
    if (belongsToMarket && belongsToUser && outcomeWon) {
      const outcomeInt = parseInt(share.outcomeToken.event, 10)

      // multiple shares bought for same outcome
      if (!winningsByOutcome[outcomeInt]) {
        winningsByOutcome[outcomeInt] = Decimal(0)
      }
      winningsByOutcome[outcomeInt] = winningsByOutcome[outcomeInt].add(Decimal(share.balance))
    }
  })

  // object length will always be 1 if won
  return mapValues(winningsByOutcome, val => val.toString())
}

export const calcShareWinningsCategorical = (share, market, event) => {
  const outcome = parseInt(event.outcome, 10)
  const shareOutcome = parseInt(share.outcomeToken.index, 10)
  if (shareOutcome !== outcome) {
    return '0'
  }

  return Decimal(share.balance).toString()
}

export const calcShareWinningsScalar = (share, market, event) => {
  const outcomeRange = Decimal(SCALAR_OUTCOME_RANGE)
  const outcome = Decimal(parseInt(event.outcome, 10))
  const lowerBound = Decimal(event.lowerBound)
  const upperBound = Decimal(event.upperBound)

  let outcomeClamped = Decimal(0)

  if (outcome.lt(lowerBound)) {
    outcomeClamped = Decimal(0)
  } else if (outcome.gt(upperBound)) {
    outcomeClamped = outcomeRange
  } else {
    outcomeClamped = outcomeRange.mul(outcome.sub(lowerBound).toString()).div(upperBound.sub(lowerBound).toString())
  }

  const factorShort = outcomeRange.sub(outcomeClamped)
  const factorLong = outcomeRange.sub(factorShort.toString())

  const isShort = parseInt(share.outcomeToken.index, 10) === 0
  const isLong = parseInt(share.outcomeToken.index, 10)
  if (isShort) {
    return Decimal(share.balance).mul(factorShort).div(outcomeRange)
  }

  if (isLong) {
    return Decimal(share.balance).mul(factorLong).div(outcomeRange).toString()
  }

  throw new Error(`Invalid Outcome for Scalar Event found: ${share.outcomeToken.index}`)
}

export const calcShareWinnings = (share, market, event) => {
  const isCategorical = event.type === OUTCOME_TYPES.CATEGORICAL

  return isCategorical ?
    calcShareWinningsCategorical(share, market, event) :
    calcShareWinningsScalar(share, market, event)
}
