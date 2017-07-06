import { createAction } from 'redux-actions'

import * as api from 'api'

export const receiveEntities = createAction('RECEIVE_ENTITIES')
export const removeEntity = createAction('REMOVE_ENTITY')
export const updateEntity = createAction('UPDATE_ENTITY')

export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return await dispatch(receiveEntities(payload))
}

export const requestFactories = () => async (dispatch) => {
  const payload = await api.requestFactories()
  return await dispatch(receiveEntities(payload))
}
