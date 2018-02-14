import Gnosis from '@gnosis.pm/gnosisjs/'

import { hexWithPrefix, weiToEth } from 'utils/helpers'
import { OUTCOME_TYPES } from 'utils/constants'
import { NETWORK_TIMEOUT } from 'actions/blockchain'

import Decimal from 'decimal.js'

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
  if (gnosisInstance) {
    return gnosisInstance
  }

  return new Promise((resolve, reject) => {
    let stillRunning = true
    const instanceCheck = setInterval(() => {
      if (gnosisInstance) {
        stillRunning = false
        clearInterval(instanceCheck)
        return resolve(gnosisInstance)
      }
    }, 50)

    setTimeout(() => {
      if (stillRunning) {
        clearInterval(instanceCheck)
        reject(new Error('Connection to Gnosis.js timed out'))
      }
    }, NETWORK_TIMEOUT)
  })
}

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const gnosis = await getGnosisConnection()
  const account = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getAccounts((e, accounts) => (e ? reject(e) : resolve(accounts[0]))))
  return account
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

export const resolveEvent = async (event, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  await gnosis.resolveEvent({ event: event.address, outcome: parseInt(selectedOutcomeIndex, 10) })
}

export const buyShares = async (market, outcomeTokenIndex, outcomeTokenCount, cost, approvalResetAmount) => {
  const gnosis = await getGnosisConnection()

  // Markets on Gnosis has by default Ether Token as collateral Token, that has 18 decimals
  // Outcome tokens have also 18 decimals
  // The decimal values represent an offset of 18 positions on the integer value
  const collateralTokenWei = Decimal(cost)
    .mul(1e18)
    .toString()

  // The user needs to deposit amount of collateral tokens willing to pay before performing the buy
  const collateralToken = await gnosis.contracts.HumanFriendlyToken.at(await gnosis.contracts.Event.at(market.event.address).collateralToken())

  const collateralTokenName = await collateralToken.name()
  if (collateralTokenName === 'Ether Token' || collateralTokenName === 'Wrapped Ether') {
    await gnosis.etherToken.deposit({ value: collateralTokenWei })
  }

  // buyOutComeTokens handles approving
  const collateralTokensPaid = await gnosis.buyOutcomeTokens({
    market: market.address,
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCount.toString(),
    cost: collateralTokenWei,
    approvalResetAmount,
  })

  return collateralTokensPaid
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
  const minProfit = Decimal(earnings)
    .mul(1e18)
    .round()
    .toString()

  const collateralTokensReceived = await gnosis.sellOutcomeTokens({
    market: hexWithPrefix(marketAddress),
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCountWei,
    minProfit,
    approvalResetAmount,
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
    await marketContract.withdrawFees()
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
  const gasCost = await gnosis.createCategoricalEvent.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcScalarEventGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createScalarEvent.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcCentralizedOracleGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createCentralizedOracle.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcMarketGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.createMarket.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcBuySharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.buyOutcomeTokens.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcSellSharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.sellOutcomeTokens.estimateGas({ using: 'stats' })
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
  const event = await gnosis.contracts.Event.at(eventAddress)

  const gasGost = await event.redeemWinnings.estimateGas()
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
  return Gnosis.requireEventFromTXResult(
    await gnosis.olympiaAddressRegistry.register(mainnetAddress),
    'AddressRegistration',
  )
}
