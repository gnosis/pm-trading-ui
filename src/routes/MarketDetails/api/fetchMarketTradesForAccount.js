import { API_URL } from 'api/rest'
import { normalize } from 'normalizr'
import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { marketTradesSchema } from 'api/schema'

const fetchMarketTradesForAccount = async (marketAddress, accountAddress) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`)
  return normalize(payload.results, [marketTradesSchema])
}

export default fetchMarketTradesForAccount
