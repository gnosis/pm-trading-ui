import uuid from 'uuid/v4'
import * as api from 'api'

import { receiveEntities, updateEntity } from 'actions/entities'
import { closeModal } from 'actions/modal'
import { startLog, closeLog, closeEntrySuccess, closeEntryError } from 'actions/transactions'

import { OUTCOME_TYPES, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'
import { REVOKE_TOKENS } from 'utils/transactionExplanations'

import { getRedeemedShares } from 'selectors/market'

/**
 * Constant names for marketcreation stages
 * @readonly
 * @enum {string}
 */
export const TRANSACTION_STAGES = {
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
export const TRANSACTION_EVENTS_GENERIC = [
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
