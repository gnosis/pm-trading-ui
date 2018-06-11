import { createSelector } from 'reselect'
import Decimal from 'decimal.js'
import moment from 'moment'

import { add0xPrefix } from 'utils/helpers'
import { calcShareWinnings } from 'routes/Dashboard/containers/Dashboard/utils'
import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import { getCurrentAccount } from 'integrations/store/selectors'
import { getEvents } from 'store/selectors/event'
import { getOracles } from 'store/selectors/oracle'
import { getEventDescriptions } from 'store/selectors/eventDescription'
import { MARKET_STAGES } from 'utils/constants'

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

export const eventSharesSelector = createSelector(getCurrentAccount, getShares, (account, shares) => {
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
})

export const enhanceShares = (oracles, events, eventDescriptions, eventMarkets, eventShares) => {
  const enhancedShares = {}

  Object.keys(eventShares).forEach((eventAddress) => {
    const event = events[eventAddress]
    const market = eventMarkets[eventAddress]
    const shares = eventShares[eventAddress]

    if (!event || !market || !shares) {
      return
    }

    const oracle = oracles[event.oracle]
    const eventDescription = eventDescriptions[oracle.eventDescription]
    const { resolutionDate } = eventDescription
    shares.forEach((share) => {
      if (Decimal(share.balance).eq(0)) {
        return
      }

      const isShareEventResolved = oracle.isOutcomeSet && event.isWinningOutcomeSet
      const isShareMarketClosed =
        market.stage === MARKET_STAGES.MARKET_CLOSED || moment(resolutionDate).isBefore(moment().utc())
      const shareWinning = isShareEventResolved ? calcShareWinnings(share, market, event) : '0'

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
        market: {
          ...market,
          eventDescription,
          event,
        },
        oracle,
        winnings: shareWinning,
        value: maximumWin.mul(probability).toString(),
        isResolved: isShareEventResolved,
        isRedeemable: isShareEventResolved,
        isClosed: isShareMarketClosed,
        isSellable: !isShareEventResolved && !isShareMarketClosed,
      }
    })
  })

  const enhancedSharesSorted = {}
  Object.keys(enhancedShares)
    .sort((a, b) => {
      const { outcomeToken: { index: firstOutcomeIndex } } = enhancedShares[a]
      const { outcomeToken: { index: secondOutcomeIndex } } = enhancedShares[b]

      return firstOutcomeIndex - secondOutcomeIndex
    })
    .forEach((shareId) => {
      enhancedSharesSorted[shareId] = { ...enhancedShares[shareId] }
    })

  return enhancedSharesSorted
}

export const getAccountShares = createSelector(
  getOracles,
  getEvents,
  getEventDescriptions,
  eventMarketsSelector,
  eventSharesSelector,
  getCurrentAccount,
  enhanceShares,
)

export const getRedeemedShares = (state, marketAddress) => {
  const shares = getAccountShares(state)

  const redeemedShares = {}
  Object.keys(shares).forEach((shareId) => {
    const share = shares[shareId]
    if (share.market && share.market.address === marketAddress) {
      redeemedShares[shareId] = share
    }
  })
  return redeemedShares
}
