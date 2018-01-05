import { hexWithoutPrefix } from 'utils/helpers'
import { normalize } from 'normalizr'
import { requestFromRestAPI, requestFromRestAPIAllPages } from 'utils/fetch'

import { marketSchema, marketSharesSchema, marketTradesSchema } from './schema'

// TODO The default assignment is because JEST test do not work out of the box with ENV variables. Fix that using the plugin dotenv(for example)
const addresses = Object.keys(process.env.WHITELIST || {}).map(address => hexWithoutPrefix(address))

export const requestMarket = async (marketAddress) => {
  const payload = await requestFromRestAPI(`markets/${hexWithoutPrefix(marketAddress)}/`)
  return normalize({ ...payload, local: false }, marketSchema)
}


export const requestMarkets = async () => {
  const payload = await requestFromRestAPI('markets/', { creator: addresses.join() })
  return normalize(payload.results.filter(market => typeof market.funding !== 'undefined'), [marketSchema])
}

export const requestFactories = async () => requestFromRestAPI('factories')

export const requestMarketTradesForAccount = async (marketAddress, accountAddress) => {
  const payload = await requestFromRestAPI(`markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`)
  return normalize(payload.results, [marketTradesSchema])
}

export const requestMarketTrades = async (market) => {
  const payload = await requestFromRestAPIAllPages(`markets/${hexWithoutPrefix(market.address)}/trades/`, {}, 200)
  return normalize(payload.results, [marketTradesSchema])
}

export const requestAccountTrades = async (accountAddress) => {
  const payload = await requestFromRestAPI(`account/${hexWithoutPrefix(accountAddress)}/trades/`)
  return normalize(payload.results.map(trade => ({ ...trade, owner: accountAddress })), [marketTradesSchema])
}


export const requestAccountShares = async (address) => {
  const payload = await requestFromRestAPI(`account/${hexWithoutPrefix(address)}/shares/`)
  return normalize(payload.results, [marketSharesSchema])
}

export const requestMarketShares = async (marketAddress, accountAddress) => {
  const payload = await requestFromRestAPI(`markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
  return normalize(payload.results, [marketSharesSchema])
}
