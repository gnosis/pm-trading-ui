import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { normalize } from 'normalizr'
import qs from 'querystring'
import { marketSchema, marketSharesSchema, marketTradesSchema } from './schema'

const { config } = process.env.CONFIG

export const API_URL = `${config.gnosisdb.protocol}://${config.gnosisdb.host}/api`

// TODO The default assignment is because JEST test do not work out of the box with ENV variables. Fix that using the plugin dotenv(for example)
const addresses = Object.keys(process.env.WHITELIST || {}).map(address => hexWithoutPrefix(address))
const whitelistedAddressesFilter = qs.stringify({ creator: addresses.join() }, ',')

// TODO delete when src/routes/marketlist is fully operative
export const requestMarkets = async () => {
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
