/* globals __ETHEREUM_HOST__ */

import Gnosis from '@gnosis.pm/gnosisjs'

import { hexWithPrefix } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'
import { normalize } from 'normalizr'

import delay from 'await-delay'
import moment from 'moment'
import Decimal from 'decimal.js'

const GNOSIS_OPTIONS = {
  ethereum: __ETHEREUM_HOST__,
}

let gnosisInstance
export const getGnosisConnection = async () => {
  if (gnosisInstance) {
    return gnosisInstance
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

export const getCurrentAccount = async () => {
  const gnosis = await getGnosisConnection()

  return gnosis.web3.eth.accounts[0]
}


export const createEventDescription = async (eventDescription) => {
  console.log('eventDescription', eventDescription)
  const gnosis = await getGnosisConnection()
  // console.log(description)

  const ipfsHash = await gnosis.publishEventDescription(eventDescription)

  await delay(1000)

  return {
    ipfsHash,
    local: true,
    ...eventDescription,
  }
}

export const createOracle = async (oracle) => {
  console.log('oracle', oracle)
  const gnosis = await getGnosisConnection()
  let oracleContract

  if (oracle.type === ORACLE_TYPES.CENTRALIZED) {
    oracleContract = await gnosis.createCentralizedOracle(oracle.eventDescription)
  } else if (oracle.type === ORACLE_TYPES.ULTIMATE) {
    // TODO: add remaining parameters and document
    oracleContract = await gnosis.createUltimateOracle(oracle)
  } else {
    throw new Error('invalid oracle type')
  }

  return {
    address: oracleContract.address,
    owner: await getCurrentAccount(),
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    ...oracle,
  }
}

export const createEvent = async (event) => {
  console.log('event', event)
  const gnosis = await getGnosisConnection()

  let eventContract

  const eventData = {
    ...event,
    collateralToken: gnosis.etherToken.address,
  }

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    eventContract = await gnosis.createCategoricalEvent(eventData)
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    eventContract = await gnosis.createScalarEvent(eventData)
  } else {
    throw new Error('invalid outcome/event type')
  }
  return {
    address: eventContract.address,
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    ...event,
    collateralToken: gnosis.etherToken.address,
  }
}

export const createMarket = async (market) => {
  console.log('market', market)
  const gnosis = await getGnosisConnection()

  const marketContract = await gnosis.createMarket({
    ...market,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
  })
  
  return {
    ...market,
    netOutcomeTokensSold: market.outcomes.map(() => '0'),
    funding: market.funding,
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    marketMaker: gnosis.lmsrMarketMaker.address,
    marketFactory: gnosis.standardMarketFactory.address,
    address: marketContract.address,
  }
}

export const fundMarket = async (market) => {
  console.log('funding', market)
  const gnosis = await getGnosisConnection()

  // this would be great:
  // await gnosis.approveToken(gnosis.etherToken.address, marketFunding.toString())
  // await gnosis.fundMarket(marketAddress, marketFunding)

  const marketContract = gnosis.contracts.Market.at(market.address)
  const marketFunding = Decimal(market.funding)
  const marketFundingWei = marketFunding.times(1e18)

  await gnosis.etherToken.deposit({ value: marketFundingWei.toString() })
  await gnosis.etherToken.approve(marketContract.address, marketFundingWei.toString())

  await marketContract.fund(marketFundingWei.toString())

  return market
}

export const buyShares = async (market, outcomeTokenIndex, outcomeTokenCount) => {
  const gnosis = await getGnosisConnection()

  const outcomeTokenCountWei = Decimal(outcomeTokenCount).mul(1e18)

  await gnosis.etherToken.deposit({ value: outcomeTokenCountWei.toString() })
  await gnosis.etherToken.approve(hexWithPrefix(market.address), outcomeTokenCountWei.toString())

  return await gnosis.buyOutcomeTokens({ market, outcomeTokenIndex, outcomeTokenCount: outcomeTokenCountWei })
}

export const resolveOracle = async (oracle, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  const oracleContract = await gnosis.contracts.CentralizedOracle.at(hexWithPrefix(oracle.address))

  if (oracleContract) {
    return await oracleContract.setOutcome(parseInt(selectedOutcomeIndex, 10))
  }

  throw Error('Oracle contract could not be found - unsupported oracle type?')
}

export const sellShares = async (marketAddress, outcomeTokenIndex, outcomeTokenCount) => {
  const gnosis = await getGnosisConnection()

  const outcomeTokenCountWei = Decimal(outcomeTokenCount).mul(1e18).toString()

  return await gnosis.sellOutcomeTokens({
    market: hexWithPrefix(marketAddress),
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCountWei,
  })
}

export const calcLMSRCost = Gnosis.calcLMSRCost
export const calcLMSROutcomeTokenCount = Gnosis.calcLMSROutcomeTokenCount
export const calcLMSRMarginalPrice = Gnosis.calcLMSRMarginalPrice
