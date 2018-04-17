import { hexWithoutPrefix, restFetch } from 'utils/helpers'
import { getConfiguration } from 'utils/features'
import { normalize } from 'normalizr'
import qs from 'querystring'
import { marketSchema, marketSharesSchema, marketTradesSchema } from './schema'

const config = getConfiguration()

export const API_URL = `${config.gnosisdb.protocol}://${config.gnosisdb.host}/api`

// TODO delete when src/routes/marketlist is fully operative
export const requestMarkets = async () => {
  const addresses = Object.keys(config.whitelist).map(hexWithoutPrefix)
  const whitelistedAddressesFilter = qs.stringify({ creator: addresses.join() }, ',')

  const url = `${API_URL}/markets/?${whitelistedAddressesFilter}`

  return restFetch(url).then(response =>
    normalize(response.results.filter(market => typeof market.funding !== 'undefined'), [marketSchema]))
}

export const requestAccountTrades = async (accountAddress) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(accountAddress)}/trades/`)
  return normalize(payload.results.map(trade => ({ ...trade, owner: accountAddress })), [marketTradesSchema])
}

export const requestAccountShares = async (address) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/shares/`)
  return normalize(payload.results, [marketSharesSchema])
}
