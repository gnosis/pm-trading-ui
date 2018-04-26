import { receiveEntities } from 'store/actions//entities'
import { fetchMarketTradesForAccount } from '../../api'

/**
 * Requests users trades (tradehistory) for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Tradeowner Address
 */
const requestMarketTradesForAccount = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await fetchMarketTradesForAccount(marketAddress, accountAddress)
  return dispatch(receiveEntities(payload))
}

export default requestMarketTradesForAccount
