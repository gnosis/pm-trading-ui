import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import integrations from 'integrations/store/reducers'

import { isFeatureEnabled } from 'utils/features'

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

export default combineReducers(reducers)
