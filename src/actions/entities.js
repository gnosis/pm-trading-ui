import { createAction } from 'redux-actions'

import * as api from 'api'

export const receiveEntities = createAction('RECEIVE_ENTITIES')
export const removeEntity = createAction('REMOVE_ENTITY')
export const updateEntity = createAction('UPDATE_ENTITY')

export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return await dispatch(receiveEntities(payload))
}

export const requestCategoricalEvents = () => async (dispatch) => {
  const payload = await api.requestCategoricalEvents()
  return await dispatch(receiveEntities(payload))
}

export const requestCategoricalEventDescriptions = () => async (dispatch) => {
  const payload = await api.requestCategoricalEventDescriptions()
  return await dispatch(receiveEntities(payload))
}

export const requestScalarEvents = () => async (dispatch) => {
  const payload = await api.requestScalarEvents()
  return await dispatch(receiveEntities(payload))
}

export const requestScalarEventDescriptions = () => async (dispatch) => {
  const payload = await api.requestScalarEventDescriptions()
  return await dispatch(receiveEntities(payload))
}

export const requestCentralizedOracles = () => async (dispatch) => {
  const payload = await api.requestCentralizedOracles()
  return await dispatch(receiveEntities(payload))
}
