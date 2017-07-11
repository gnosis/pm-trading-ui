import Gnosis from '@gnosis.pm/gnosisjs'

import { normalizeHex, hexWithPrefix } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'

const GNOSIS_OPTIONS = {}

let gnosisInstance
const getGnosisConnection = async () => {
  if (gnosisInstance) {
    return Promise.resolve(gnosisInstance)
  }

  try {
    gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)
    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }

  return gnosisInstance
}

const getCurrentAccount = async () => {
  const gnosis = await getGnosisConnection()

  return gnosis.web3.eth.accounts[0]
}


export const createEventDescription = async (description) => {
  const gnosis = await getGnosisConnection()

  return await gnosis.publishEventDescription(description)
}

export const createOracle = async (opts) => {
  const gnosis = await getGnosisConnection()
  let oracleContract

  if (opts.oracleType === ORACLE_TYPES.CENTRALIZED) {
    oracleContract = await gnosis.createCentralizedOracle(opts.ipfsHash)
  } else if (opts.oracleType === ORACLE_TYPES.ULTIMATE) {
    const oracle = {
      ipfsHash: opts.ipfsHash,
      // TODO: add remaining parameters and document
    }
    oracleContract = await gnosis.createUltimateOracle(oracle)
  } else {
    throw new Error('invalid oracle type')
  }

  return oracleContract
}

export const createEvent = async (event) => {
  const gnosis = await getGnosisConnection()

  let eventContract

  if (event.outcomeType === OUTCOME_TYPES.CATEGORICAL) {
    eventContract = await gnosis.createCategoricalEvent(event)
  } else if (event.outcomeType === OUTCOME_TYPES.SCALAR) {
    eventContract = await gnosis.createScalarEvent(event)
  } else {
    throw new Error('invalid outcome/event type')
  }

  return eventContract
}

export const createMarket = async (market) => {
  const gnosis = await getGnosisConnection()
  const account = await getCurrentAccount()

  await gnosis.etherToken.deposit(market.funding)
  await gnosis.etherToken.approve(account, market.funding)

  return await gnosis.createMarket(market)
}

/**
 * Creates all necessary contracts to create a whole market.
 *
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string[]} opts.outcomes
 * @param {string} opts.resolutionDate - ISO String Date
 * @param {(string|Contract)} opts.collateralToken
 * @param {(string|Contract)} opts.oracle
 * @param {(string|Contract)} opts.marketFactory
 * @param {(string|Contract)} opts.marketMaker
 * @param {(number|BigNumber)} opts.funding
 * @param {(number|BigNumber)} opts.fee
 */
export const composeMarket = async (marketValues) => {
  const gnosis = await getGnosisConnection()
  const account = await getCurrentAccount()

  const eventDescriptionData = {
    description: marketValues.description,
    title: marketValues.title,
    outcomes: marketValues.outcomes,
    resolutionDate: marketValues.resolutionDate,
  }
  const ipfsHash = await createEventDescription(eventDescriptionData)


  const oracleData = {
    oracleType: marketValues.oracleType,
    ipfsHash,
  }
  const oracle = await createOracle(oracleData)


  const eventData = {
    collateralToken: gnosis.etherToken, // default token right now
    outcomeCount: marketValues.outcomes.length,
    outcomeType: marketValues.outcomeType,
    oracle,
  }
  const event = await createEvent(eventData)


  const marketData = {
    funding: marketValues.funding,
    fee: marketValues.fee,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
    event,
  }
  const market = await createMarket(marketData)


  const oracleAddress = normalizeHex(oracle.address)
  const accountAddress = normalizeHex(account.address)
  const eventAddress = normalizeHex(event.address)
  const marketAddress = normalizeHex(market.address)
  const collateralTokenAddress = normalizeHex(event.collateralToken.address)

  // fix-me: horrible
  return {
    entities: {
      eventDescriptions: {
        [ipfsHash]: {
          ...eventDescriptionData,
          ipfsHash,
        },
      },
      oracles: {
        [oracleAddress]: {
          ...oracleData,
          address: oracleAddress,
          isOutcomeSet: false,
          outcome: null,
          creator: accountAddress,
          owner: accountAddress,
          eventDescription: ipfsHash,
        },
      },
      events: {
        [eventAddress]: {
          ...eventData,
          address: eventAddress,
          collateralToken: collateralTokenAddress,
          creator: accountAddress,
          oracle: oracleAddress,
        },
      },
      markets: {
        [marketAddress]: {
          ...marketData,
          marketMaker: normalizeHex(marketData.marketMaker.address),
          marketFactory: normalizeHex(marketData.marketFactory.address),
          event: eventAddress,
          creationDate: new Date(),
          creator: accountAddress,
        },
      },
    },
  }
}

export const buyShares = async (market, outcomeIndex, amount) => {
  const gnosis = await getGnosisConnection()
  console.log(market)
  // calculate buy cost

  // TODO: get actual market maker here
  // TODO: calculate cost + fee from amount

  const maxCost = Math.pow(10, 18) * 5
  const amountWei = amount * (Math.pow(10, 18))

  const marketContract = await gnosis.contracts.Market.at(hexWithPrefix(market.address))

  gnosis.etherToken.approve(hexWithPrefix(market.address), amountWei.toString())
  marketContract.buy(outcomeIndex, amountWei.toString(), maxCost.toString())
}
