import {
  requestMarkets,
  receiveEntities,
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
  console.log(JSON.stringify(createdEntities))
  return dispatch(receiveEntities(createdEntities))
}

export const buyMarketShares = options => async (dispatch) => {
  // placeholder
  return Promise.resolve()
}
