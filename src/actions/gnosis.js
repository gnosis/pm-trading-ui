import Gnosis from '@gnosis.pm/gnosisjs'
import { flow } from 'lodash'

import { EVENT_TYPES, ORACLE_TYPES } from 'integrations/constants'
import * as api from 'api'

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

const getFactories = async () => await api.requestFactories()

const createEventDescription = async (opts) => {
  const gnosis = await getGnosisConnection()

  const description = {
    description: opts.description,
    title: opts.title,
    outcomes: opts.outcomes,
    resolutionDate: opts.resolutionDate,
  }

  console.log("eventDescription deploy", JSON.stringify(description, null, 2))

  const ipfsHash = await gnosis.publishEventDescription(description)

  return {
    ...opts,
    ...description,
    ipfsHash,
  }
}

const createOracle = async (opts) => {
  const gnosis = await getGnosisConnection()

  console.log("deploying oracle", opts)

  let oracleContract

  if (opts.oracleType === ORACLE_TYPES.CENTRALIZED) {

    console.log("oracle deploy", JSON.stringify(opts.ipfsHash, null, 2))

    oracleContract = await gnosis.createCentralizedOracle(opts.ipfsHash)
  } else if (opts.oracleType === ORACLE_TYPES.ULTIMATE) {
    const oracle = {
      ipfsHash: opts.ipfsHash,
      // TODO: add remaining parameters and document
    }
    oracleContract = await gnosis.createUltimateOracle(oracle)
  }

  console.log(oracleContract)

  return {
    ...opts,
    oracle: oracleContract,
  }
}

const createEvent = async (opts) => {
  const gnosis = await getGnosisConnection()

  console.log("deploying event", opts)

  let eventContract

  if (opts.eventType === EVENT_TYPES.CATEGORICAL) {
    const event = {
      collateralToken: opts.collateralToken,
      oracle: opts.oracle,
      outcomeCount: opts.outcomes.length,
    }

    eventContract = await gnosis.createCategoricalEvent(event)
  } else if (opts.eventType === EVENT_TYPES.SCALAR) {
    const event = {
      collateralToken: opts.collateralToken,
      oracle: opts.oracle,
      lowerBound: opts.lowerBound,
      upperBound: opts.upperBound,
    }
    eventContract = await gnosis.createScalarEvent(event)
  }

  return {
    ...opts,
    event: eventContract,
  }
}

const createMarket = async (opts) => {
  const gnosis = await getGnosisConnection()

  await gnosis.etherToken.deposit(1000000000)
  //await gnosis.etherToken.approve(1000000000)

  const market = {
    marketFactory: gnosis.standardMarketFactory,
    event: opts.event,
    marketMaker: opts.marketMaker,
    fee: opts.fee,
  }

  const marketContract = await gnosis.createMarket(market)

  return {
    ...opts,
    ...marketContract,
  }
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
export const composeMarket = opts => async (dispatch) => {
  const gnosis = await getGnosisConnection()
  opts.collateralToken = gnosis.etherToken
  opts.marketFactory = gnosis.standardMarketFactory
  opts.marketMaker = gnosis.lmsrMarketMaker

  let contractBundle = opts
  contractBundle = await createEventDescription(opts)
  contractBundle = await createOracle(contractBundle)
  contractBundle = await createEvent(contractBundle)
  contractBundle = await createMarket(contractBundle)

  console.log("successfully deployed", contractBundle)

  return contractBundle
}
