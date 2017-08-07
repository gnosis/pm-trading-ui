import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { normalize } from 'normalizr'

import sha1 from 'sha1'

import {
  marketSchema,
} from './schema'

const API_URL = __GNOSISDB_HOST__

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
  restFetch(`${API_URL}/api/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}`)
    // unfortunately we need to return the shares as a market entity to be able to index on it
    // so we create an array for the market shares with the entities we receive here.
    .then(response => normalize({
      address: marketAddress,
      shares: response.map(share => ({
        id: sha1(`${marketAddress}-${accountAddress}-${share.outcomeToken.address}`), // unique identifier for shares
        event: share.outcomeToken.event,
        ...share,
      })),
    }, marketSchema))
