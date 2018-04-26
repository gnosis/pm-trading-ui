import { receiveEntities } from 'store/actions//entities'
import { fetchMarketSharesForAccount } from '../../api'

/**
 * Requests shares for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Shareowner Address
 */
const requestMarketSharesForAccount = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await fetchMarketSharesForAccount(marketAddress, accountAddress)
  return dispatch(receiveEntities(payload))
}

export default requestMarketSharesForAccount
