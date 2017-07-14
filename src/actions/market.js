import {
  requestMarkets,
  receiveEntities,
  updateEntity
} from 'actions/entities'

import * as api from 'api'

export const requestMarketList = () => async (dispatch) => {
  await dispatch(requestMarkets())
  /*
  await dispatch(requestCentralizedOracles())
  await dispatch(requestCategoricalEvents())
  await dispatch(requestCategoricalEventDescriptions())
  await dispatch(requestScalarEvents())
  await dispatch(requestScalarEventDescriptions())
  */
}

export const createMarket = options => async (dispatch) => {
  const createdEntities = await api.composeMarket(options)

  if (createdEntities) {
    return dispatch(receiveEntities(createdEntities))
  }
}

export const buyMarketShares = (market, outcomeIndex, amount) => async (dispatch) => {
  await api.buyShares(market, outcomeIndex, amount)

  const netOutcomeTokensSold = market.netOutcomeTokensSold
  const newOutcomeTokenAmount = parseInt(netOutcomeTokensSold[outcomeIndex], 10) + (amount * 1e18)
  netOutcomeTokensSold[outcomeIndex] = newOutcomeTokenAmount.toString()

  return dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      netOutcomeTokensSold,
    },
  }))
}
