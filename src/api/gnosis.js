import Gnosis from '@gnosis.pm/gnosisjs'

import { hexWithoutPrefix, hexWithPrefix } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'

import delay from 'await-delay'
import moment from 'moment'
import Decimal from 'decimal.js'

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

  await delay(1000)

  return {
    address: oracleContract.address,
    isOutcomeSet: false,
    owner: await getCurrentAccount(),
    creator: await getCurrentAccount(),
    creationBlock: undefined,
    creationDate: moment().format(),
    local: true,
    ...oracle,
  }
}

export const createEvent = async (event) => {
  console.log('event', event)
  const gnosis = await getGnosisConnection()

  // hardcoded for current version
  // event.collateralToken = gnosis.etherToken

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

  await delay(1000)

  return {
    address: eventContract.address,
    isWinningOutcomeSet: false,
    owner: await getCurrentAccount(),
    creator: await getCurrentAccount(),
    creationBlock: undefined,
    creationDate: moment().format(),
    local: true,
    ...event,
    collateralToken: gnosis.etherToken.address,
  }
}

export const createMarket = async (market) => {
  console.log('market', market)
  const gnosis = await getGnosisConnection()
  // market.funding = Decimal(market.funding).div(1e18).toString()

  const marketContract = await gnosis.createMarket({
    ...market,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
  })
  console.log(marketContract)

  await delay(1000)

  return {
    ...market,
    netOutcomeTokensSold: market.outcomes.map(() => '0'),
    stage: 1,
    local: true,
    owner: await getCurrentAccount(),
    creator: await getCurrentAccount(),
    creationBlock: undefined,
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

  await gnosis.etherToken.deposit({ value: marketFunding.toString() })
  await gnosis.etherToken.approve(marketContract.address, marketFunding.toString())

  await marketContract.fund(marketFunding.toString())

  await delay(1000)

  return market
}

export const buyShares = async (market, selectedOutcomeIndex, collateralTokenAmount) => {
  const gnosis = await getGnosisConnection()

  const collateralTokenWei = new Decimal(collateralTokenAmount).mul(1e18).toString()

  const marketContract = await gnosis.contracts.Market.at(hexWithPrefix(market.address))
  const outcomeIndex = parseInt(selectedOutcomeIndex, 10)

  const outcomeTokenAmount = Gnosis.calcLMSROutcomeTokenCount({
    netOutcomeTokensSold: market.netOutcomeTokensSold,
    cost: collateralTokenWei,
    funding: market.funding,
    outcomeTokenIndex: outcomeIndex,
  })

  await gnosis.etherToken.deposit({ value: collateralTokenWei })
  await gnosis.etherToken.approve(hexWithPrefix(market.address), collateralTokenWei)

  return await marketContract.buy(outcomeIndex, outcomeTokenAmount.toString(), collateralTokenWei.toString())
}

export const resolveOracle = async (oracle, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  const oracleContract = await gnosis.contracts.CentralizedOracle.at(hexWithPrefix(oracle.address))

  if (oracleContract) {
    return await oracleContract.setOutcome(parseInt(selectedOutcomeIndex, 10))
  }

  throw Error('Oracle contract could not be found - unsupported oracle type?')
}

export const calcLMSRCost = Gnosis.calcLMSRCost
export const calcLMSROutcomeTokenCount = Gnosis.calcLMSROutcomeTokenCount
export const calcLMSRMarginalPrice = Gnosis.calcLMSRMarginalPrice
