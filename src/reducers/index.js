import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import integrations from 'integrations/store/reducers'
import users from 'routes/Scoreboard/store/reducers/users'
import market, { REDUCER_ID } from 'store/reducers/market'
import { isTournament } from 'utils/configuration'
import entities from './entities'
import modal from './modal'
import transactions from './transactions'
import blockchain from './blockchain'
import notifications from './notifications'

const reducers = {
  routing: routerReducer,
  form: formReducer,
  modal,
  entities,
  transactions,
  blockchain,
  notifications,
  integrations,
  [REDUCER_ID]: market,
}

if (isTournament()) {
  reducers.tournament = combineReducers({
    ranking: users,
  })
}

const combinedReducers = combineReducers(reducers)

const rootReducer = (state, action) => {
  let resultState = state
  if (action.type === 'LOAD_LOCALSTORAGE') {
    resultState = {
      ...state,
      ...action.payload,
    }
  }
  return combinedReducers(resultState, action)
}

export default rootReducer
