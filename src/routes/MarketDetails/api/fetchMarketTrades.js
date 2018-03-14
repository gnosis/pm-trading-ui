import { API_URL } from 'api/rest'
import { normalize } from 'normalizr'
import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { marketTradesSchema } from 'api/schema'

const requestMarketTrades = async (market) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(market.address)}/trades/`)
  return normalize(payload.results, [marketTradesSchema])
}

export default requestMarketTrades
