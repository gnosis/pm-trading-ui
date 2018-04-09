import allowedRangePrice from 'utils/marginPrice'
import uuid from 'uuid/v4'
import * as api from 'api'
import { fetchMarket, buyShares } from 'routes/MarketDetails/api'
import Decimal from 'decimal.js'
import { startLog, closeLog, closeEntrySuccess, closeEntryError } from 'actions/transactions'
import { openModal, closeModal } from 'actions/modal'
import gaSend from 'utils/analytics/gaSend'
import { receiveEntities, updateEntity } from 'actions/entities'
import { MAX_ALLOWANCE_WEI, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'
import { SETTING_ALLOWANCE, DEPOSIT } from 'utils/transactionExplanations'
import { TRANSACTION_EVENTS_GENERIC, TRANSACTION_STAGES } from 'actions/market'

import { buyShares } from 'api'

/**
 * Buy shares on specific market
 * @param {Market} market - Market to buy shares on
 * @param {number} outcomeIndex - Index of outcome to buy shares for
 * @param {number|string|BigNumber} outcomeTokenCount - Amount of tokenshares to buy
 * @param {number|string|BigNumber} cost - Max transaction cost allowed in Ether
 */
const buyMarketShares = (market, outcomeIndex, outcomeTokenCount, cost) => async (dispatch) => {
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

  const collateralToken = await gnosis.contracts.HumanFriendlyToken.at(await gnosis.contracts.Event.at(market.event.address).collateralToken())
  const userCollateralTokenBalance = (await collateralToken.balanceOf(currentAccount)).toString()
  const neededDepositAmount = Decimal(cost)
    .mul(1e18)
    .sub(userCollateralTokenBalance)

  const transactions = []

  if (neededDepositAmount.gt(0)) {
    const neededDepositFormatted = neededDepositAmount
      .div(1e18)
      .toDP(4, 1)
      .toString()

    transactions.push(DEPOSIT(
      neededDepositFormatted,
      'ETH',
      outcomeTokenCount
        .div(1e18)
        .toDP(2)
        .toNumber(),
    ))
  }
  if (approvalResetAmount) transactions.unshift(SETTING_ALLOWANCE)

  const payload = await fetchMarket(market.address)
  const updatedMarket = payload.entities.markets[market.address]
  const updatedPrice = updatedMarket.marginalPrices[outcomeIndex]
  const oldPrice = market.marginalPrices[outcomeIndex]
  if (!allowedRangePrice(oldPrice, updatedPrice)) {
    dispatch(openModal({ modalName: 'ModalOutcomePriceChanged' }))
    return dispatch(receiveEntities(payload))
  }

  gaSend(['event', 'Transactions', 'trading-interface', 'Buy shares transactions start'])

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Buying Shares for "${market.eventDescription.title}"`))
  try {
    await buyShares(market, outcomeIndex, outcomeTokenCount, cost, approvalResetAmount, neededDepositAmount)
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

  return dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

export default buyMarketShares
