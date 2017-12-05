import { get, filter, values } from 'lodash'
import Decimal from 'decimal.js'
import { isMarketResolved, isMarketClosed, weiToEth, add0xPrefix } from 'utils/helpers'
import { OUTCOME_TYPES } from 'utils/constants'
import { createSelector } from 'reselect'
import { getCurrentAccount } from 'selectors/blockchain'

import { entitySelector } from './entities'
import { getEventByAddress } from './event'
import { getOracleByAddress } from './oracle'
import { getEventDescriptionByAddress } from './eventDescription'

export const getMarketById = state => (marketAddress) => {
  const marketEntities = entitySelector(state, 'markets')

  let market = {}
  if (marketEntities[marketAddress]) {
    const marketEntity = marketEntities[marketAddress]

    const marketEvent = getEventByAddress(state)(marketEntity.event)

    if (!marketEvent) {
      return market
    }

    const eventOracle = getOracleByAddress(state)(marketEvent.oracle)

    if (!eventOracle) {
      return market
    }

    const oracleEventDescription = getEventDescriptionByAddress(state)(eventOracle.eventDescription)

    if (!oracleEventDescription) {
      return market
    }

    market = {
      ...marketEntities[marketAddress],
      event: marketEvent,
      oracle: eventOracle,
      eventDescription: oracleEventDescription,
    }
  }

  return market
}

export const getMarketShareByShareId = state => (shareAddress) => {
  const marketShareEntities = entitySelector(state, 'marketShares')

  return marketShareEntities[shareAddress]
}

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'markets')

  return Object.keys(marketEntities).map(getMarketById(state))
}

export const getMarketShares = (state) => {
  if (!state.entities) {
    return undefined
  }

  if (!state.entities.marketShares) {
    return undefined
  }

  return state.entities.marketShares
}

export const getMarketSharesByMarket = state => (marketAddress) => {
  const marketEntity = getMarketById(state)(marketAddress)
  const shares = get(state, 'entities.marketShares', {})

  const sharesFiltered = Object.keys(shares).map(shareId => shares[shareId]).filter(share => share.outcomeToken.event === marketEntity.event.address)
  return sharesFiltered
}

export const filterMarkets = state => (opts) => {
  const marketEntities = getMarkets(state)

  const {
    textSearch, resolved, onlyMyMarkets, onlyModeratorsMarkets, defaultAccount,
  } = opts

  return marketEntities.filter(market =>
    (!textSearch ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1) &&
      (!onlyMyMarkets || market.creator === defaultAccount.toLowerCase()) &&
      (!onlyModeratorsMarkets || process.env.WHITELIST[market.creator] !== undefined) &&
      (typeof resolved === 'undefined' ||
        (resolved === 'RESOLVED' && (isMarketResolved(market) || isMarketClosed(market))) ||
        (resolved === 'UNRESOLVED' && !isMarketResolved(market) && !isMarketClosed(market))))
}

/**
 * Sorts markets collection
 * @param {*} markets, array of market objects
 * @param {*} orderBy, orderBy criteria
 */
export const sortMarkets = (markets = [], orderBy = null) => {
  switch (orderBy) {
  case 'RESOLUTION_DATE_ASC':
    return markets.sort((a, b) => a.eventDescription.resolutionDate > b.eventDescription.resolutionDate)
  case 'RESOLUTION_DATE_DESC':
    return markets.sort((a, b) => a.eventDescription.resolutionDate < b.eventDescription.resolutionDate)
  case 'TRADING_VOLUME_DESC':
    return markets.sort((a, b) => {
      const tradingA = Decimal(a.tradingVolume)
        .div(1e18)
        .toDP(2, 1)
      const tradingB = Decimal(b.tradingVolume)
        .div(1e18)
        .toDP(2, 1)

      return tradingB.comparedTo(tradingA)
    })
  case 'TRADING_VOLUME_ASC':
    return markets.sort((a, b) => {
      const tradingA = Decimal(a.tradingVolume)
        .div(1e18)
        .toDP(2, 1)
      const tradingB = Decimal(b.tradingVolume)
        .div(1e18)
        .toDP(2, 1)

      return tradingA.comparedTo(tradingB)
    })
  default:
    return markets.sort((a, b) => {
      const resolvedA = get(a, 'oracle.isOutcomeSet', false)
      const resolvedB = get(b, 'oracle.isOutcomeSet', false)

      if (resolvedA === resolvedB) {
        return 0
      }

      return resolvedA ? 1 : -1
    })
  }
}

/**
 * Returns the array of a markets participant's related trades
 * @param {*} state
 */
export const getMarketParticipantsTrades = state => () => {
  const tradesArray = []
  const tradesObject = state.entities.trades
  if (tradesObject) {
    Object.keys(state.entities.trades).map(key => tradesArray.push(tradesObject[key]))
  }
  return tradesArray
}

/**
 * Returns the shares for the given account address
 * @param {*} state
 * @param {String} account, an address
 */
export const getAccountShares = (state, account) => {
  const marketShareEntities = entitySelector(state, 'marketShares')
  if (!account) {
    return marketShareEntities
  }

  return filter(marketShareEntities, share => share.owner === account)
}

/**
 * Returns the trades for the given account address
 * @param {*} state
 * @param {String} account, an address
 */
export const getAccountTrades = (state, account) => {
  const accountTrades = entitySelector(state, 'accountTrades')
  return accountTrades[account] ? accountTrades[account].trades : []
}

export const getAccountPredictiveAssets = (state, account) => {
  let predictiveAssets = new Decimal(0)

  if (account) {
    const shares = values(getAccountShares(state, account))
    if (shares.length) {
      predictiveAssets = shares.reduce(
        (assets, share) => assets.add(new Decimal(share.balance).mul(share.marginalPrice)),
        new Decimal(0),
      )
    }
  }
  return predictiveAssets
}

export const getAccountParticipatingInEvents = (state, account) => {
  const events = []

  if (account) {
    const shares = values(getAccountShares(state, account))

    if (shares.length) {
      shares.map((share) => {
        if (events.indexOf(share.outcomeToken.event) === -1) {
          events.push(share.outcomeToken.event)
        }
        return events
      })
    }
  }
  return events
}

export default {
  getMarkets,
}
