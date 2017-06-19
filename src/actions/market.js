import { createAction } from 'redux-actions'

import {
  requestMarkets,
  requestCentralizedOracles,
  requestCategoricalEvents,
  requestCategoricalEventDescriptions,
  requestScalarEvents,
  requestScalarEventDescriptions,
} from 'actions/entities'

import * as api from 'api'

export const requestMarketList = () => async (dispatch) => {
  await dispatch(requestMarkets())
  await dispatch(requestCentralizedOracles())
  await dispatch(requestCategoricalEvents())
  await dispatch(requestCategoricalEventDescriptions())
  await dispatch(requestScalarEvents())
  await dispatch(requestScalarEventDescriptions())
}
