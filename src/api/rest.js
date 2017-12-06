import {
  restFetch,
  hexWithoutPrefix,
  addIdToObjectsInArray,
  getOutcomeName,
  normalizeScalarPoint,
} from 'utils/helpers'
import { normalize } from 'normalizr'
import { OUTCOME_TYPES } from 'utils/constants'
import qs from 'querystring'
import { marketSchema, marketSharesSchema } from './schema'

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

export const requestMarketParticipantTrades = async (marketAddress, accountAddress) =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`).then(response => addIdToObjectsInArray(response.results))

const transformMarketTrades = (trade, market) =>
  trade.marginalPrices.reduce(
    (prev, current, outcomeIndex) => {
      const toReturn = { ...prev }
      toReturn[getOutcomeName(market, outcomeIndex)] = current
      return toReturn
    },
    {
      date: trade.date,
      scalarPoint:
        OUTCOME_TYPES.SCALAR === market.event.type ? normalizeScalarPoint(trade.marginalPrices, market) : undefined,
    },
  )

const getFirstGraphPoint = (market) => {
  let firstPoint
  if (OUTCOME_TYPES.SCALAR === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: normalizeScalarPoint(['0.5', '0.5'], market),
    }
  } else if (OUTCOME_TYPES.CATEGORICAL === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: undefined,
      ...market.eventDescription.outcomes.reduce((prev, current) => {
        const toReturn = {
          ...prev,
        }
        toReturn[current] = 1 / market.eventDescription.outcomes.length
        return toReturn
      }, {}),
    }
  }
  return firstPoint
}

const getLastGraphPoint = trades => ({ ...trades[trades.length - 1], date: new Date().toISOString() })

export const requestMarketTrades = async market =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(market.address)}/trades/`).then((response) => {
    const trades = response.results.map(result => transformMarketTrades(result, market))
    const firstPoint = getFirstGraphPoint(market)
    const lastPoint = trades.length ? getLastGraphPoint(trades) : { ...firstPoint, date: new Date().toISOString() }
    return [firstPoint, ...trades, lastPoint]
  })

export const requestAccountTrades = async address =>
  restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/trades/`).then(response => response.results)

export const requestAccountShares = async (address) => {
  const payload = await restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/shares/`)
  return normalize(payload.results, [marketSharesSchema])
}

export const requestMarketShares = async (marketAddress, accountAddress) => {
  const payload = await restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
  return normalize(payload.results, [marketSharesSchema])
}
