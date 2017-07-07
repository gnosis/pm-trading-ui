import Gnosis from '@gnosis.pm/gnosisjs'
import { flow } from 'lodash'

import { normalizeHex } from 'utils/helpers'

import { receiveEntities } from 'actions/entities'

import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'
import * as api from 'api'

const GNOSIS_OPTIONS = {}

let gnosisInstance
const getGnosisConnection = async () => {
  if (gnosisInstance) {
    return Promise.resolve(gnosisInstance)
  }

  //console.log('instance creation')
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

const createEventDescription = async (description) => {
  const gnosis = await getGnosisConnection()

  return await gnosis.publishEventDescription(description)
}

const createOracle = async (opts) => {
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

const createEvent = async (event) => {
  const gnosis = await getGnosisConnection()

  let eventContract
  //console.log('creating event', event)

  if (event.outcomeType === OUTCOME_TYPES.CATEGORICAL) {
    //console.log('creating categorical event')
    /*
    const event = {
      collateralToken: opts.collateralToken,
      oracle: opts.oracle,
      outcomeCount: opts.outcomes.length,
    }
    */
    //console.log('event data', event)

    eventContract = await gnosis.createCategoricalEvent(event)
  } else if (event.outcomeType === OUTCOME_TYPES.SCALAR) {
    /*
    const event = {
      collateralToken: opts.collateralToken,
      oracle: opts.oracle,
      lowerBound: opts.lowerBound,
      upperBound: opts.upperBound,
    }
    */
    eventContract = await gnosis.createScalarEvent(event)
  } else {
    throw new Error('invalid outcome/event type')
  }

  return eventContract
}

const createMarket = async (market) => {
  const gnosis = await getGnosisConnection()
  const account = await getCurrentAccount()
  //console.log('market data', market)
  //console.log(gnosis)
  await gnosis.etherToken.deposit(market.funding)
  await gnosis.etherToken.approve(account, market.funding)

  /*
  const market = {
    marketFactory: gnosis.standardMarketFactory,
    event: opts.event,
    marketMaker: opts.marketMaker,
    fee: opts.fee,
  }
  */

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
export const composeMarket = marketValues => async (dispatch) => {
  const gnosis = await getGnosisConnection()
  const account = await getCurrentAccount()

  const eventDescriptionData = {
    description: marketValues.description,
    title: marketValues.title,
    outcomes: marketValues.outcomes,
    resolutionDate: marketValues.resolutionDate,
  }
  const ipfsHash = await createEventDescription(eventDescriptionData)
  //console.log('eventDescription ipfsHash:', ipfsHash)

  const oracleData = {
    oracleType: marketValues.oracleType,
    ipfsHash,
  }
  const oracle = await createOracle(oracleData)
  //console.log('oracle:', oracle)

  const eventData = {
    collateralToken: gnosis.etherToken, // default token right now
    outcomeCount: marketValues.outcomes.length,
    outcomeType: marketValues.outcomeType,
    oracle,
  }
  const event = await createEvent(eventData)
  //console.log('event:', event)

  const marketData = {
    funding: marketValues.funding,
    fee: marketValues.fee,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
    event,
  }
  const market = await createMarket(marketData)
  //console.log('market:', market)

  const oracleAddress = normalizeHex(oracle.address)
  const accountAddress = normalizeHex(account.address)
  const eventAddress = normalizeHex(event.address)
  const marketAddress = normalizeHex(market.address)
  const collateralTokenAddress = normalizeHex(event.collateralToken.address)

  dispatch(receiveEntities({
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
  }))
}
