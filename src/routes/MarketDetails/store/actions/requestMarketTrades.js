import { receiveEntities } from 'actions/entities'
import { fetchMarketTrades } from '../../api'

/**
 * Requests all trades (tradehistory) on a market from GnosisDB.
 * @param {Market} market
 */
export const requestMarketTrades = market => async (dispatch) => {
  const payload = await fetchMarketTrades(market)
  return dispatch(receiveEntities(payload))
}

export default requestMarketTrades
