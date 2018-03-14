import { API_URL } from 'api/rest'
import { normalize } from 'normalizr'
import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { marketSharesSchema } from 'api/schema'

const fetchMarketSharesForAccount = async (marketAddress, accountAddress) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
  return normalize(payload.results, [marketSharesSchema])
}

export default fetchMarketSharesForAccount
