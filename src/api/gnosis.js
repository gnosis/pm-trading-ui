import Gnosis from '@gnosis.pm/gnosisjs'

import { hexWithoutPrefix, hexWithPrefix } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'

import delay from 'await-delay'
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

  await delay(5000)
  
  return {
    ipfsHash,
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

  await delay(5000)

  return {
    oracle: oracleContract.address,
    ...oracle,
  }
}

export const createEvent = async (event) => {
  console.log('event', event)
  const gnosis = await getGnosisConnection()

  // hardcoded for current version
  // event.collateralToken = gnosis.etherToken

  let eventContract

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    eventContract = await gnosis.createCategoricalEvent({
      ...event,
      collateralToken: gnosis.etherToken,
    })
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    eventContract = await gnosis.createScalarEvent({
      ...event,
      collateralToken: gnosis.etherToken,
      lowerBound: event.lowerBound * (10 ** event.decimals),
      upperBound: event.upperBound * (10 ** event.decimals),
    })
  } else {
    throw new Error('invalid outcome/event type')
  }

  await delay(5000)

  return {
    event: eventContract.address,
    ...event,
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

  await delay(5000)

  return {
    ...market,
    market: marketContract.address,
  }
}

export const fundMarket = async (market) => {
  console.log('funding', market)
  const gnosis = await getGnosisConnection()

  const marketContract = gnosis.contracts.Market.at(market.market)
  const marketFunding = Decimal(market.funding).div(1e18)

  await gnosis.etherToken.deposit({ value: marketFunding.toString() })
  await gnosis.etherToken.approve(marketContract.address, marketFunding.toString())

  const balance = await gnosis.etherToken.balanceOf(gnosis.web3.eth.accounts[0])
  // console.log(`Ethertoken balance: ${balance.div(1e18).toFixed(4)}`)

  if (balance.lt(marketFunding)) {
    throw new Error(`Not enough funds: required ${marketFunding.toFixed(5)} of ${balance.div(1e18).toFixed(5)}`)
  }

  await marketContract.fund(marketFunding.toString())

  await delay(5000)

  return market
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
    decimals: (marketValues.decimals || 2).toString(),
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
    decimals: marketValues.decimals || 0,
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


  const oracleAddress = hexWithoutPrefix(oracle.address)
  const accountAddress = hexWithoutPrefix(account.address)
  const eventAddress = hexWithoutPrefix(event.address)
  const marketAddress = hexWithoutPrefix(market.address)
  const collateralTokenAddress = hexWithoutPrefix(event.collateralToken.address)

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
          address: marketAddress,
          marketMaker: hexWithoutPrefix(marketData.marketMaker.address),
          marketFactory: hexWithoutPrefix(marketData.marketFactory.address),
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

  const collateralTokenWei = new Decimal(collateralTokenAmount).mul(1e18).toString()
  // console.log(collateralTokenWei)

  const marketContract = await gnosis.contracts.Market.at(hexWithPrefix(market.address))
  const outcomeIndex = parseInt(selectedOutcomeIndex, 10)

  const outcomeTokenAmount = Gnosis.calcLMSROutcomeTokenCount({
    netOutcomeTokensSold: market.netOutcomeTokensSold,
    cost: collateralTokenWei,
    funding: market.funding,
    outcomeTokenIndex: outcomeIndex,
  })

  const outcomeTokenAmountFix = outcomeTokenAmount.mul(0.99).floor()

  // console.log(outcomeTokenAmount.div(1e18).toString())
  // console.log("deposit")
  await gnosis.etherToken.deposit({ value: collateralTokenWei })
  // console.log("approve")
  await gnosis.etherToken.approve(hexWithPrefix(market.address), collateralTokenWei)

  // console.log("buy shares")
  return await marketContract.buy(outcomeIndex, outcomeTokenAmountFix.toString(), collateralTokenWei.toString())
}

export const calcLMSRCost = Gnosis.calcLMSRCost
export const calcLMSROutcomeTokenCount = Gnosis.calcLMSROutcomeTokenCount
export const calcLMSRMarginalPrice = Gnosis.calcLMSRMarginalPrice
