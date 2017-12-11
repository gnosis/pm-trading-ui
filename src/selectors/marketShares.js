import { createSelector } from 'reselect'
import Decimal from 'decimal.js'

import { add0xPrefix, calcShareWinnings } from 'utils/helpers'
import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import { getCurrentAccount } from './blockchain'
import { getEvents } from './event'
import { getOracles } from './oracle'

export const getShares = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.marketShares) {
    return {}
  }

  return state.entities.marketShares
}

const eventMarketsSelector = (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  const { markets } = state.entities
  const eventMarkets = {}

  Object.keys(markets).forEach((marketAddress) => {
    eventMarkets[markets[marketAddress].event] = markets[marketAddress]
  })

  return eventMarkets
}

const eventMarketSelector = marketAddress => (state) => {
  if (!state.entities) {
    return {}
  }

  if (!state.entities.markets) {
    return {}
  }

  if (!state.entities.markets[marketAddress]) {
    return {}
  }

  const market = state.entities.markets[marketAddress]

  return { [market.event]: market }
}

const eventSharesSelector = createSelector(
  getCurrentAccount,
  getShares,
  (account, shares) => {
    const eventShares = {}

    Object.keys(shares).forEach((shareId) => {
      if (add0xPrefix(shares[shareId].owner) !== add0xPrefix(account)) {
        return
      }

      const eventAddress = add0xPrefix(shares[shareId].event)

      if (!eventShares[eventAddress]) {
        eventShares[eventAddress] = []
      }
      eventShares[eventAddress].push({
        ...shares[shareId],
        id: shareId,
      })
    })

    return eventShares
  },
)

const enhanceShares = (oracles, events, eventMarkets, eventShares, account) => {
  const enhancedShares = {}
  console.log(eventShares)
  console.log(eventMarkets)
  Object.keys(eventShares).forEach((eventAddress) => {
    const event = events[eventAddress]
    const market = eventMarkets[eventAddress]
    const shares = eventShares[eventAddress]

    if (!event || !market || !shares) {
      return
    }

    const oracle = oracles[event.oracle]

    shares.forEach((share) => {
      if (Decimal(share.balance).eq(0)) {
        return
      }

      const isShareEventResolved = oracle.isOutcomeSet && event.isWinningOutcomeSet
      const shareWinning = isShareEventResolved ? calcShareWinnings(share, market, event, account) : '0'

      if (isShareEventResolved && Decimal(shareWinning).eq(0)) {
        return
      }

      const probability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
      const maximumWin = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: share.balance,
      })

      enhancedShares[share.id] = {
        ...share,
        event,
        market,
        oracle,
        winnings: shareWinning,
        value: maximumWin.mul(probability).toString(),
        isResolved: isShareEventResolved,
        isRedeemable: isShareEventResolved,
        isSellable: !isShareEventResolved,
      }
    })
  })

  return enhancedShares
}

export const getAccountShares = createSelector(
  getOracles,
  getEvents,
  eventMarketsSelector,
  eventSharesSelector,
  getCurrentAccount,
  enhanceShares,
)

export const getMarketShares = marketAddress => createSelector(
  getOracles,
  getEvents,
  eventMarketSelector(marketAddress),
  eventSharesSelector,
  getCurrentAccount,
  enhanceShares,
)
