import Gnosis from '@gnosis.pm/gnosisjs/'
import { requireEventFromTXResult } from '@gnosis.pm/gnosisjs/dist/utils'

import { hexWithPrefix, weiToEth } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES, MAX_ALLOWANCE_WEI } from 'utils/constants'

import moment from 'moment'
import Decimal from 'decimal.js'

const NETWORK_TIMEOUT = 15000

let gnosisInstance

export const {
  calcLMSRCost, calcLMSROutcomeTokenCount, calcLMSRMarginalPrice, calcLMSRProfit,
} = Gnosis

/**
 * Initializes connection to GnosisJS
 * @param {*dictionary} GNOSIS_OPTIONS
 */
export const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  try {
    gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)
    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

/**
 * Returns an instance of the connection to GnosisJS
 */
export const getGnosisConnection = async () => {
  if (!gnosisInstance) {
    throw new Error('GnosisJS not initialized yet')
  }

  return gnosisInstance
}

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const gnosis = await getGnosisConnection()

  return gnosis.defaultAccount
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account) => {
  const gnosis = await getGnosisConnection()
  const balanceValue = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getBalance(account, (e, balance) => (e ? reject(e) : resolve(weiToEth(balance.toString())))))
  return balanceValue
}

const normalizeEventDescription = (eventDescription, eventType) => {
  const eventDescriptionNormalized = {
    title: eventDescription.title,
    resolutionDate: eventDescription.resolutionDate,
    description: eventDescription.description,
  }
  if (eventType === OUTCOME_TYPES.CATEGORICAL) {
    eventDescriptionNormalized.outcomes = eventDescription.outcomes
  } else if (eventType === OUTCOME_TYPES.SCALAR) {
    eventDescriptionNormalized.decimals = parseInt(eventDescription.decimals, 10)
    eventDescriptionNormalized.unit = eventDescription.unit
  } else if (eventType === undefined) {
    throw new Error('Must pass eventType')
  }
  return eventDescriptionNormalized
}

export const createEventDescription = async (eventDescription, eventType) => {
  console.log('eventDescription', eventDescription)
  const eventDescriptionNormalized = normalizeEventDescription(eventDescription, eventType)
  const gnosis = await getGnosisConnection()
  // console.log(description)

  const ipfsHash = await gnosis.publishEventDescription(eventDescriptionNormalized)

  return {
    ipfsHash,
    local: true,
    ...eventDescriptionNormalized,
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
    address: hexWithPrefix(oracleContract.address),
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
    collateralToken: hexWithPrefix(gnosis.olympiaToken.address),
  }

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    eventContract = await gnosis.createCategoricalEvent(eventData)
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    eventContract = await gnosis.createScalarEvent(eventData)
  } else {
    throw new Error('invalid outcome/event type')
  }

  return {
    address: hexWithPrefix(eventContract.address),
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    ...event,
    collateralToken: hexWithPrefix(gnosis.olympiaToken.address),
  }
}

export const createMarket = async (market) => {
  console.log('market', market)
  const gnosis = await getGnosisConnection()
  const fee = Decimal(market.fee)
    .mul(10000)
    .trunc()
    .toString() // fee times 10000 as uint24

  const marketContract = await gnosis.createMarket({
    ...market,
    fee,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
  })

  return {
    ...market,
    netOutcomeTokensSold: market.outcomes.map(() => '0'),
    funding: market.funding,
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    marketMaker: hexWithPrefix(gnosis.lmsrMarketMaker.address),
    marketFactory: hexWithPrefix(gnosis.standardMarketFactory.address),
    address: hexWithPrefix(marketContract.address),
    tradingVolume: '0',
    collectedFees: '0',
  }
}

export const fundMarket = async (market) => {
  console.log('funding', market)
  const gnosis = await getGnosisConnection()

  // this would be great:
  // await gnosis.approveToken(gnosis.etherToken.address, marketFunding.toString())
  // await gnosis.fundMarket(marketAddress, marketFunding)

  const marketContract = gnosis.contracts.Market.at(hexWithPrefix(market.address))
  const marketFunding = Decimal(market.funding)
  const marketFundingWei = marketFunding.times(1e18)

  const collateralToken = await gnosis.contracts.HumanFriendlyToken.at(await gnosis.contracts.Event.at(market.event).collateralToken())

  if ((await collateralToken.name()) === 'Ether Token') {
    await gnosis.etherToken.deposit({ value: marketFundingWei.toString() })
  }

  const marketAllowance = await gnosis.olympiaToken.allowance(
    hexWithPrefix(market.creator),
    hexWithPrefix(marketContract.address),
  )

  if (marketAllowance.lt(marketFundingWei)) {
    await collateralToken.approve(hexWithPrefix(marketContract.address), MAX_ALLOWANCE_WEI)
  }

  await marketContract.fund(marketFundingWei.toString())

  return market
}

/**
 * Closes a market
 * @param {*object} market
 */
export const closeMarket = async (market) => {
  const gnosis = await getGnosisConnection()
  const marketContract = gnosis.contracts.Market.at(hexWithPrefix(market.address))
  requireEventFromTXResult(await marketContract.close(), 'MarketClosing')

  return market
}

const STEP_ONE_OF_ONE = '<span style="font-weight: bold">QR 1/1</span>'
const STEP_ONE_OF_TWO = '<span style="font-weight: bold">QR 1/2</span>'
const STEP_TWO_OF_TWO = '<span style="font-weight: bold">QR 2/2</span>'
const APPROVE_TX_OPTS = 'Setting allowance'

export const buyShares = async (market, outcomeTokenIndex, outcomeTokenCount, cost, approvalResetAmount) => {
  const gnosis = await getGnosisConnection()

  // Markets on Gnosis has by default Ether Token as collateral Token, that has 18 decimals
  // Outcome tokens have also 18 decimals
  // The decimal values represent an offset of 18 positions on the integer value
  const collateralTokenWei = Decimal(cost).mul(1e18).toString()

  // The user needs to deposit amount of collateral tokens willing to pay before performing the buy
  const collateralToken = await gnosis.contracts.HumanFriendlyToken.at(await gnosis.contracts.Event.at(market.event.address).collateralToken())

  if ((await collateralToken.name()) === 'Ether Token') {
    await gnosis.etherToken.deposit({ value: collateralTokenWei })
  }
  const BUY_TX_OPTS = `Investing ${cost} OLY`

  const info = {
    approveTxOpts: {
      explanation: approvalResetAmount ? `${STEP_ONE_OF_TWO} ${APPROVE_TX_OPTS}` : undefined,
    },
    buyTxOpts: {
      explanation: approvalResetAmount ? `${STEP_TWO_OF_TWO} ${BUY_TX_OPTS}` : `${STEP_ONE_OF_ONE} ${BUY_TX_OPTS}`,
    },
  }

  // buyOutComeTokens handles approving
  const collateralTokensPaid = await gnosis.buyOutcomeTokens({
    market: market.address,
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCount.toString(),
    cost: collateralTokenWei,
    approvalResetAmount,
    ...info,
  })

  return collateralTokensPaid
}

export const resolveEvent = async (event, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  await gnosis.resolveEvent({ event: event.address, outcome: parseInt(selectedOutcomeIndex, 10) })
}

export const sellShares = async (
  marketAddress,
  outcomeTokenIndex,
  outcomeTokenCount,
  earnings,
  approvalResetAmount,
) => {
  const gnosis = await getGnosisConnection()

  const outcomeTokenCountWei = Decimal(outcomeTokenCount)
    .mul(1e18)
    .toString()
  const minProfit = Decimal(earnings).mul(1e18).round().toString()

  const SELL_TX_OPTS = `Selling ${outcomeTokenCount} outcome tokens`

  const info = {
    approveTxOpts: {
      explanation: approvalResetAmount ? `${STEP_ONE_OF_TWO} ${APPROVE_TX_OPTS}` : undefined,
    },
    sellTxOpts: {
      explanation: approvalResetAmount ? `${STEP_TWO_OF_TWO} ${SELL_TX_OPTS}` : `${STEP_ONE_OF_ONE} ${SELL_TX_OPTS}`,
    },
  }

  const collateralTokensReceived = await gnosis.sellOutcomeTokens({
    market: hexWithPrefix(marketAddress),
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCountWei,
    minProfit,
    approvalResetAmount,
    ...info,
  })

  return collateralTokensReceived
}

export const redeemWinnings = async (eventType, eventAddress) => {
  const gnosis = await getGnosisConnection()

  const eventContract =
    eventType === OUTCOME_TYPES.CATEGORICAL
      ? await gnosis.contracts.CategoricalEvent.at(eventAddress)
      : await gnosis.contracts.ScalarEvent.at(eventAddress)

  if (eventContract) {
    return Gnosis.requireEventFromTXResult(await eventContract.redeemWinnings(), 'WinningsRedemption')
  }
  throw new Error("Invalid Event - can't find the specified Event, invalid Eventtype?")
}

export const withdrawFees = async (marketAddress) => {
  const gnosis = await getGnosisConnection()

  const marketContract = gnosis.contracts.Market.at(marketAddress)

  if (marketContract) {
    return marketContract.withdrawFees()
  }

  throw new Error("Invalid Market - can't find the specified Market")
}

/*
* Gas Calculation functions
*/
export const calcFundingGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return gnosis.contracts.Market.gasStats.fund.averageGasUsed
}

export const calcCategoricalEventGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createCategoricalEvent.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

export const calcScalarEventGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createScalarEvent.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

export const calcCentralizedOracleGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createCentralizedOracle.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

export const calcMarketGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createMarket.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

export const calcBuySharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.buyOutcomeTokens.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

export const calcSellSharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.sellOutcomeTokens.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasCost
}

/**
 * Returns gas cost for redeem winnings
 * @param {*object} opts options
 * @param {*string} opts.eventAddress Address for the event
 */

export const calcRedeemWinningsGasCost = async (opts) => {
  const { eventAddress } = opts
  if (!eventAddress) {
    return undefined
  }

  const gnosis = await getGnosisConnection()
  const Event = await gnosis.contracts.Event.at(eventAddress)

  const gasGost = await Event.redeemWinnings.estimateGas({
    marketFactory: gnosis.contracts.StandardMarketFactory,
    using: 'stats',
  })
  return gasGost
}

/**
 * Returns the current gas price
 */
export const getGasPrice = async () => {
  const gnosis = await getGnosisConnection()
  const gasPrice = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getGasPrice((e, r) => (e ? reject(e) : resolve(r))))
  return gasPrice
}

/**
 * Returns the amount of ether tokens
 * @param {*string} account address
 */
export const getEtherTokens = async (account) => {
  const gnosis = await getGnosisConnection()

  if (gnosis && gnosis.etherToken) {
    const balance = await gnosis.etherToken.balanceOf(account) // balance is a BigNumber
    return new Decimal(balance.toFixed(0))
  }
  return undefined
}

export const getOlympiaTokensByAccount = async (account) => {
  const gnosis = await getGnosisConnection()
  const balance = await gnosis.olympiaToken.balanceOf(account)
  return new Decimal(balance.toFixed(0)).toString()
}

export const getMainnetAddressForRinkebyAccount = async (account) => {
  const gnosis = await getGnosisConnection()
  const address = await gnosis.olympiaAddressRegistry.mainnetAddressFor(hexWithPrefix(account))

  return address
}

export const setMainnetAddressForRinkebyAccount = async (mainnetAddress) => {
  const gnosis = await getGnosisConnection()
  return Gnosis.requireEventFromTXResult(await gnosis.olympiaAddressRegistry.register(mainnetAddress), 'AddressRegistration')
}
