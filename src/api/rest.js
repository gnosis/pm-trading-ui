import {
  restFetch,
  hexWithoutPrefix,
} from 'utils/helpers'
import { normalize } from 'normalizr'
import qs from 'querystring'
import { marketSchema, marketSharesSchema, marketTradesSchema } from './schema'

const API_URL = `${process.env.GNOSISDB_URL}/api`

// TODO The default assignment is because JEST test do not work out of the box with ENV variables. Fix that using the plugin dotenv(for example)
const addresses = Object.keys(process.env.WHITELIST || {}).map(address => hexWithoutPrefix(address))
const whitelistedAddressesFilter = qs.stringify({ creator: addresses.join() }, ',')

export const requestMarket = async marketAddress =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/`).then(response =>
    normalize({ ...response, local: false }, marketSchema))

export const requestMarkets = async () => {
  const url = `${API_URL}/markets/?${whitelistedAddressesFilter}`

  return restFetch(url).then(response =>
    normalize(response.results.filter(market => typeof market.funding !== 'undefined'), [marketSchema]))
}

export const requestFactories = async () => restFetch(`${API_URL}/factories`)

export const requestMarketTradesForAccount = async (marketAddress, accountAddress) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`)
  return normalize(payload.results, [marketTradesSchema])
}

export const requestMarketTrades = async (market) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(market.address)}/trades/`)
  return normalize(payload.results, [marketTradesSchema])
}

export const requestAccountTrades = async (accountAddress) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(accountAddress)}/trades/`)
  return normalize(payload.results.map(trade => ({ ...trade, owner: accountAddress })), [marketTradesSchema])
}


export const requestAccountShares = async (address) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/shares/`)
  return normalize(payload.results, [marketSharesSchema])
}

export const requestMarketShares = async (marketAddress, accountAddress) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
  return normalize(payload.results, [marketSharesSchema])
}
