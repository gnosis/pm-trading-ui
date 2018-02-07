import allowedRangePrice from 'utils/marginPrice'
import Decimal from 'decimal.js'
import uuid from 'uuid/v4'
import * as api from 'api'

import { receiveEntities, updateEntity } from 'actions/entities'
import { openModal, closeModal } from 'actions/modal'
import { startLog, closeLog, closeEntrySuccess, closeEntryError } from 'actions/transactions'

import { OUTCOME_TYPES, TRANSACTION_COMPLETE_STATUS, MARKET_STAGES, MAX_ALLOWANCE_WEI } from 'utils/constants'
import { DEPOSIT, SELL, REVOKE_TOKENS, SETTING_ALLOWANCE } from 'utils/transactionExplanations'
import gaSend from 'utils/analytics/gaSend'

import { getRedeemedShares } from 'selectors/market'

/**
 * Constant names for marketcreation stages
 * @readonly
 * @enum {string}
 */
const TRANSACTION_STAGES = {
  EVENT_DESCRIPTION: 'eventDescription',
  ORACLE: 'oracle',
  EVENT: 'event',
  MARKET: 'market',
  FUNDING: 'funding',
  // Others
  GENERIC: 'generic',
}

/**
 * Generic Stage for single-event transactions
 */
const TRANSACTION_EVENTS_GENERIC = [
  {
    event: TRANSACTION_STAGES.GENERIC,
    label: 'Sending Transaction',
  },
]

/**
 * Requests details about a single market from GnosisDB.
 * @param {string} marketAddress - Markets Address
 */
export const requestMarket = marketAddress => async (dispatch) => {
  const payload = await api.requestMarket(marketAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Requests all markets from GnosisDB.
 */
export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return dispatch(receiveEntities(payload))
}

/**
 * Requests shares for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Shareowner Address
 */
export const requestMarketShares = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await api.requestMarketShares(marketAddress, accountAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Requests factores (MarketFactory, EventFactory, etc) from GnosisDB.
 * @deprecated - Unused currently
 */
export const requestFactories = () => async (dispatch) => {
  const payload = await api.requestFactories()
  return dispatch(receiveEntities(payload))
}

/**
 * Requests users trades (tradehistory) for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Tradeowner Address
 */
export const requestMarketTradesForAccount = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await api.requestMarketTradesForAccount(marketAddress, accountAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Requests all trades (tradehistory) on a market from GnosisDB.
 * @param {Market} market
 */
export const requestMarketTrades = market => async (dispatch) => {
  const payload = await api.requestMarketTrades(market)
  return dispatch(receiveEntities(payload))
}

/**
 * Dispatches the shares for the given account address
 * @param {String} accountAddress
 */
export const requestAccountShares = accountAddress => async (dispatch) => {
  const payload = await api.requestAccountShares(accountAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Dispatches the trades for the given account address
 * @param {String} accountAddress
 */
export const requestAccountTrades = accountAddress => async (dispatch) => {
  const payload = await api.requestAccountTrades(accountAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Buy shares on specific market
 * @param {Market} market - Market to buy shares on
 * @param {number} outcomeIndex - Index of outcome to buy shares for
 * @param {number|string|BigNumber} outcomeTokenCount - Amount of tokenshares to buy
 * @param {number|string|BigNumber} cost - Max transaction cost allowed in Ether
 */
export const buyMarketShares = (market, outcomeIndex, outcomeTokenCount, cost) => async (dispatch) => {
  const transactionId = uuid()
  const gnosis = await api.getGnosisConnection()

  const transactionCost = api.calcLMSRCost(
    market.netOutcomeTokensSold,
    market.funding,
    outcomeIndex,
    outcomeTokenCount,
    market.fee,
  )

  // Reset the allowance if the cost of current transaction is greater than the current allowance
  const currentAccount = await api.getCurrentAccount()
  const marketAllowance = await gnosis.etherToken.allowance(currentAccount, market.address)
  const approvalResetAmount = transactionCost.gte(marketAllowance.toString()) ? MAX_ALLOWANCE_WEI : null

  const transactions = [
    DEPOSIT(
      cost,
      'ETH',
      outcomeTokenCount
        .div(1e18)
        .toDP(2)
        .toNumber(),
    ),
  ]

  if (approvalResetAmount) transactions.unshift(SETTING_ALLOWANCE)

  const payload = await api.requestMarket(market.address)
  const updatedMarket = payload.entities.markets[market.address]
  const updatedPrice = updatedMarket.marginalPrices[outcomeIndex]
  const oldPrice = market.marginalPrices[outcomeIndex]
  if (!allowedRangePrice(oldPrice, updatedPrice)) {
    dispatch(openModal({ modalName: 'ModalOutcomePriceChanged' }))
    return await dispatch(receiveEntities(payload))
  }

  gaSend(['event', 'Transactions', 'trading-interface', 'Buy shares transactions start'])

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Buying Shares for "${market.eventDescription.title}"`))
  try {
    await api.buyShares(market, outcomeIndex, outcomeTokenCount, cost, approvalResetAmount)
    await dispatch(closeEntrySuccess, transactionId, TRANSACTION_STAGES.GENERIC)
    gaSend(['event', 'Transactions', 'trading-interface', 'Buy shares transactions succeeded'])
    await dispatch(closeModal())
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
    await dispatch(closeModal())
    throw e
  }

  const { netOutcomeTokensSold } = market
  const newOutcomeTokenAmount = Decimal(netOutcomeTokensSold[outcomeIndex]).add(outcomeTokenCount)
  netOutcomeTokensSold[outcomeIndex] = newOutcomeTokenAmount.toString()

  await dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      netOutcomeTokensSold,
    },
  }))

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Sell shares on a specific market
 * @param {Market} market - Market to sell shares on
 * @param {MarketShare} share - Marketshare object
 * @param {number|string|BigNumber} outcomeTokenCount - Amount of tokenshares to sell
 */
export const sellMarketShares = (market, share, outcomeTokenCount, earnings) => async (dispatch) => {
  const transactionId = uuid()
  const gnosis = await api.getGnosisConnection()
  const currentAccount = await api.getCurrentAccount()

  const { outcomeToken: { index: outcomeIndex } } = share

  // Reset the allowance if the cost of current transaction is greater than the current allowance
  const marketAllowance = await gnosis.contracts.Token
    .at(await gnosis.contracts.Event.at(market.event.address).outcomeTokens(outcomeIndex))
    .allowance(currentAccount, market.address)
  const outcomeCountWei = Decimal(outcomeTokenCount).mul(1e18)
  const approvalResetAmount = outcomeCountWei.gte(marketAllowance.toString()) ? MAX_ALLOWANCE_WEI : null

  const payload = await api.requestMarket(market.address)
  const updatedMarket = payload.entities.markets[market.address]
  const updatedPrice = updatedMarket.marginalPrices[outcomeIndex]
  const oldPrice = market.marginalPrices[outcomeIndex]
  if (!allowedRangePrice(oldPrice, updatedPrice)) {
    dispatch(openModal({ modalName: 'ModalOutcomePriceChanged' }))
    return dispatch(receiveEntities(payload))
  }

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Selling Shares for "${market.eventDescription.title}"`))

  gaSend(['event', 'Transactions', 'trading-interface', 'Sell shares transactions start'])
  const transactions = [
    SELL(Decimal(outcomeTokenCount)
      .toDP(2)
      .toNumber()),
  ]

  if (approvalResetAmount) transactions.unshift(SETTING_ALLOWANCE)

  try {
    await api.sellShares(market.address, outcomeIndex, outcomeTokenCount, earnings, approvalResetAmount)
    await dispatch(closeEntrySuccess, transactionId, TRANSACTION_STAGES.GENERIC)
    gaSend(['event', 'Transactions', 'trading-interface', 'Sell shares transactions succeeded'])
    await dispatch(closeModal())
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
    await dispatch(closeModal())
    throw e
  }

  await dispatch(updateEntity({
    entityType: 'marketShares',
    data: {
      id: share.id,
      balance: Decimal(share.balance)
        .sub(Decimal(outcomeCountWei))
        .toString(),
    },
  }))

  return dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Redeem winnings of a market
 * @param {Market} market - Market to redeem winnings of
 */
export const redeemWinnings = market => async (dispatch, getState) => {
  const transactionId = uuid()
  const state = getState()
  const redeemedShares = getRedeemedShares(state, market.address)

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Redeeming Winnings for  "${market.eventDescription.title}"`))

  const marketType = market.event.type
  const transactions = marketType === OUTCOME_TYPES.CATEGORICAL ? [REVOKE_TOKENS] : [REVOKE_TOKENS, REVOKE_TOKENS]

  try {
    console.log('winnings: ', await api.redeemWinnings(market.event.type, market.event.address))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))

    Object.keys(redeemedShares).forEach(shareId =>
      dispatch(updateEntity({ entityType: 'marketShares', data: { id: shareId, balance: '0' } })))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  dispatch(closeModal())

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Withdraw fees of a market
 * @param {Market} market - Market to withdraw fees of
 */
export const withdrawFees = market => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Withdrawing Fees for "${market.eventDescription.title}"`))

  try {
    console.log('fees: ', await api.withdrawFees(market.address))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  // TODO: Update market so we can't withdraw again

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

