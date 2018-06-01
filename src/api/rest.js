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

export const requestAccountTrades = async (accountAddress, collateralTokenAddress) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(accountAddress)}/trades/`)
  let trades = payload.results
  if (collateralTokenAddress) {
    trades = payload.results.filter(({ collateralToken }) => collateralToken === hexWithoutPrefix(collateralTokenAddress))
  }
  return normalize(trades, [marketTradesSchema])
}

export const requestAccountShares = async (address, collateralTokenAddress) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/shares/`)
  let shares = payload.results
  if (collateralTokenAddress) {
    shares = payload.results.filter(({ collateralToken }) => collateralToken === hexWithoutPrefix(collateralTokenAddress))
  }
  return normalize(shares, [marketSharesSchema])
}
