import { restFetch, hexWithoutPrefix, addIdToObjectsInArray, getOutcomeName } from 'utils/helpers'
import { normalize } from 'normalizr'

import sha1 from 'sha1'

import {
  marketSchema,
  tradeSchema,
} from './schema'

const API_URL = process.env.GNOSISDB_HOST

export const requestMarket = async marketAddress =>
  restFetch(`${API_URL}/api/markets/${hexWithoutPrefix(marketAddress)}`)
    .then(response => normalize(response, marketSchema))

export const requestMarkets = async () =>
  restFetch(`${API_URL}/api/markets/`)
    .then(response => normalize(
      response.results.filter(market => typeof market.funding !== 'undefined'),
      [marketSchema]),
    )

export const requestFactories = async () =>
  restFetch(`${API_URL}/api/factories`)

export const requestMarketShares = async (marketAddress, accountAddress) =>
  restFetch(`${API_URL}/api/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
    // unfortunately we need to return the shares as a market entity to be able to index on it
    // so we create an array for the market shares with the entities we receive here.
    .then(response => {
      if (!response || (typeof(response.count) !== 'undefined' && response.count === 0)) {
        return []
      }

      return normalize({
        address: marketAddress,
        shares: response.results.map(share => ({
          id: sha1(`${marketAddress}-${accountAddress}-${share.outcomeToken.address}`), // unique identifier for shares
          event: share.outcomeToken.event,
          ...share,
        })),
      }, marketSchema)
    })

export const requestMarketParticipantTrades = async (marketAddress, accountAddress) =>
  restFetch(`${API_URL}/api/markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`)
    .then(response => normalize(addIdToObjectsInArray(response.results), [tradeSchema]))


const transformMarketTrades = (trade, market, index) => (
  {
    id: sha1(`${market.address}-${trade.date}-${index}`), // unique identifier for trades
    date: trade.date,
    marginalPrices: trade.marginalPrices.reduce((prev, current, outcomeIndex) => {
      const toReturn = { ...prev }
      toReturn[getOutcomeName(market, outcomeIndex)] = current
      return toReturn
    }, {}),
  }
)

export const requestMarketTrades = async market =>
  restFetch(`${API_URL}/api/markets/${hexWithoutPrefix(market.address)}/trades/`)
    .then((response) => {
      const trades = response.results.map(
        (result, index) => transformMarketTrades(result, market, index),
      )
      return trades
    })
