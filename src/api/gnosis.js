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
    window.gnosis = gnosisInstance
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

  const marketFunding = market.funding * 1e18

  await gnosis.etherToken.deposit({ value: marketFunding.toString() })
  const balance = await gnosis.etherToken.balanceOf(gnosis.web3.eth.accounts[0])
  
  if (balance.lt(marketFunding)) {
    throw new Error(`Not enough funds: required ${(marketFunding / 1e18).toFixed(5)} of ${balance.div(1e18).toFixed(5)}`)
  }

  const marketContract = await gnosis.createMarket(market)

  await gnosis.etherToken.approve(marketContract.address, marketFunding.toString())
  await marketContract.fund(marketFunding.toString())

  return marketContract
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
    unit: marketValues.unit,
    decimals: (marketValues.decimals || 0).toString(),
    resolutionDate: marketValues.resolutionDate,
  }
  let ipfsHash
  try {
    ipfsHash = await createEventDescription(eventDescriptionData)
  } catch (err) {
    console.error('IPFS failed:', err)
    console.log(eventDescriptionData)
  }


  const oracleData = {
    oracleType: marketValues.oracleType,
    ipfsHash,
  }
  let oracle
  try {
    oracle = await createOracle(oracleData)
  } catch (err) {
    console.error('oracle creation failed', err)
    console.log(oracleData)
    return
  }


  const eventData = {
    collateralToken: gnosis.etherToken, // default token right now
    upperBound: (marketValues.upperBound || 0).toString(),
    lowerBound: (marketValues.lowerBound || 0).toString(),
    outcomeCount: (marketValues.outcomes ? marketValues.outcomes.length : 0),
    outcomeType: marketValues.outcomeType,
    oracle,
  }
  let event
  try {
    event = await createEvent(eventData)
  } catch (err) {
    console.error('event creation failed', err)
    console.log(eventData)
    return
  }


  const marketData = {
    funding: marketValues.funding,
    fee: marketValues.fee,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
    event,
  }
  let market
  try {
    market = await createMarket(marketData)
  } catch (err) {
    console.error('market creation failed', err)
    console.log(marketData)
    return
  }


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

export const buyShares = async (market, selectedOutcomeIndex, collateralTokenAmount) => {
  const gnosis = await getGnosisConnection()

  const marketContract = await gnosis.contracts.Market.at(hexWithPrefix(market.address))
  const outcomeIndex = parseInt(selectedOutcomeIndex, 10)

  const outcomeTokenAmount = Gnosis.calcLMSROutcomeTokenCount({
    netOutcomeTokensSold: marketContract.netOutcomeTokensSold,
    cost: collateralTokenAmount,
    funding: marketContract.funding,
    outcomeIndex,
  })

  await gnosis.etherToken.deposit({ value: collateralTokenAmount })
  await gnosis.etherToken.approve(hexWithPrefix(market.address), collateralTokenAmount)

  return await marketContract.buy(outcomeIndex, outcomeTokenAmount, collateralTokenAmount)
}

export const calcLMSRCost = Gnosis.calcLMSRCost
export const calcLMSROutcomeTokenCount = Gnosis.calcLMSROutcomeTokenCount
export const calcLMSRMarginalPrice = Gnosis.calcLMSRMarginalPrice
