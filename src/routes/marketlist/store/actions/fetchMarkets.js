import { List } from 'immutable'
import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'
import { BoundsRecord, MarketRecord, OutcomeRecord } from '../models'
import addMarkets from './addMarkets'

// TODO The default assignment is because JEST test do not work out of the box
// with ENV variables. Fix that using the plugin dotenv(for example)
const whitelisted = process.env.WHITELIST || {}
const addresses = Object.keys(whitelisted).map(address => hexWithoutPrefix(address))

const buildOutcomesFrom = (outcomes, marginalPrices) => {
  if (!outcomes) {
    return List([])
  }

  const outcomesRecords = outcomes.map((outcome, index) => new OutcomeRecord({
    name: outcome,
    marginalPrice: marginalPrices[index],
  }))

  return List(outcomesRecords)
}

const buildBoundsFrom = (lower, upper, unit) => BoundsRecord({ lower, upper, unit })

const extractMarkets = markets => markets.map((market) => {
  const { eventDescription } = market.event.oracle
  const { title, resolutionDate: date, outcomes: outcomesResponse } = eventDescription
  const { stage, tradingVolume, event: { type } } = market
  const outcomes = buildOutcomesFrom(outcomesResponse, market.marginalPrices)
  const { unit } = market.event.oracle.eventDescription
  const bounds = buildBoundsFrom(market.event.lowerBound, market.event.upperBound, unit)

  // eslint-disable-next-line
  const marketRecord = 
    new MarketRecord({
      title, date, stage, volume: tradingVolume, type, outcomes, bounds,
    })

  return marketRecord
})


export const processMarketResponse = (dispatch, response) => {
  if (!response || !response.results) {
    dispatch(addMarkets([]))
    return
  }

  const marketRecords = extractMarkets(response.results)
  dispatch(addMarkets(marketRecords))
}

export default () => dispatch =>
  requestFromRestAPI('markets', { creator: addresses.join() })
    .then(response => processMarketResponse(dispatch, response))
