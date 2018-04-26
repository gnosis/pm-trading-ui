import { receiveEntities } from 'store/actions//entities'
import { fetchMarket } from '../../api'

/**
 * Requests details about a single market from GnosisDB.
 * @param {string} marketAddress - Markets Address
 */
const requestMarket = marketAddress => async (dispatch) => {
  const payload = await fetchMarket(marketAddress)
  return dispatch(receiveEntities(payload))
}

export default requestMarket
