import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import integrations from 'integrations/store/reducers'

import { isFeatureEnabled } from 'utils/features'
import { LOAD_SESSIONSTORAGE } from 'store/middlewares/SessionStorageLoad'
import { LOAD_LOCALSTORAGE } from 'store/middlewares/LocalStorageLoad'

import * as routeReducers from 'routes/reducers'
import entities from './entities'
import modal from './modal'
import blockchain from './blockchain'
import notifications from './notifications'
import marketList from './market'
import marketShares from './shares'
import marketTrades from './trades'

const reducerConditions = {
  users: () => isFeatureEnabled('scoreboard'),
}

let filteredRouteReducers = {}
Object.keys(routeReducers).forEach((reducerName) => {
  if (typeof reducerConditions[reducerName] === 'function') {
    const includeReducer = reducerConditions[reducerName]()

    if (!includeReducer) {
      return true // continue
    }
  }

  filteredRouteReducers = {
    [reducerName]: routeReducers[reducerName],
    ...filteredRouteReducers,
  }

  return true
})

const reducers = {
  routing: routerReducer,
  form: formReducer,
  modal,
  entities,
  blockchain,
  notifications,
  integrations,
  marketList,
  marketShares,
  marketTrades,
  ...filteredRouteReducers,
}

const combinedReducers = combineReducers(reducers)

const rootReducer = (state, action) => {
  let resultState = state
  if (action.type === LOAD_LOCALSTORAGE || action.type === LOAD_SESSIONSTORAGE) {
    resultState = {
      ...state,
    }

    Object.keys(action.payload).forEach((key) => {
      if (resultState[key] && resultState[key].merge) {
        resultState[key] = resultState[key].merge(action.payload[key])
      } else {
        resultState[key] = { ...action.payload[key] }
      }
    })
  }
  return combinedReducers(resultState, action)
}

export default rootReducer
