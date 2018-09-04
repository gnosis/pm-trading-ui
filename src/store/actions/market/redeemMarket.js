import uuid from 'uuid/v4'
import { OUTCOME_TYPES, TRANSACTION_COMPLETE_STATUS, LOWEST_VALUE } from 'utils/constants'
import { hexWithPrefix } from 'utils/helpers'
import { closeModal } from 'store/actions/modal'
import { redeemShare } from 'store/actions/shares'
import {
  startLog, closeLog, closeEntrySuccess, closeEntryError,
} from 'routes/Transactions/store/actions/transactions'
import * as marketContractAPI from 'api/market'
import { CategoricalMarketRecord } from 'store/models/market'
import { TRANSACTION_STAGES, TRANSACTION_EVENTS_GENERIC } from 'store/actions/market/constants'
import { getMarketShares } from 'routes/MarketDetails/store/selectors'

/**
 * Redeem winnings of a market
 * @param {Market} market - Market to redeem winnings of
 */
const redeemWinnings = market => async (dispatch, getState) => {
  const transactionId = uuid()
  const state = getState()
  const sharesToRedeem = getMarketShares(market.address)(state).filter(share => share.winnings > LOWEST_VALUE)

  const outcomeType = market instanceof CategoricalMarketRecord ? OUTCOME_TYPES.CATEGORICAL : OUTCOME_TYPES.SCALAR

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Redeeming Winnings for  "${market.title}"`))

  try {
    console.log('winnings: ', await marketContractAPI.redeemWinnings(outcomeType, hexWithPrefix(market.eventAddress)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))

    sharesToRedeem.forEach(share => dispatch(redeemShare(share.id)))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  dispatch(closeModal())

  return dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

export default redeemWinnings
