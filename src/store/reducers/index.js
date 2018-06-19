import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { isFeatureEnabled } from 'utils/features'
import { LOAD_SESSIONSTORAGE } from 'store/middlewares/SessionStorageLoad'
import { LOAD_LOCALSTORAGE } from 'store/middlewares/LocalStorageLoad'

// Reducers
import integrations from 'integrations/store/reducers'
import users from 'routes/Scoreboard/store/reducers/users'
import rewards from 'routes/Scoreboard/store/reducers/rewards'
import transactions from 'routes/Transactions/store/reducers/transactions'
import market from 'store/reducers/market'
import entities from './entities'
import modal from './modal'
import blockchain from './blockchain'
import notifications from './notifications'
import shares from './shares'
import trades from './trades'

const tournamentEnabled = isFeatureEnabled('tournament')

const reducers = {
  routing: routerReducer,
  form: formReducer,
  modal,
  entities,
  transactions,
  blockchain,
  notifications,
  integrations,
  marketList: market,
  marketShares: shares,
  marketTrades: trades,
}

if (tournamentEnabled) {
  reducers.tournament = combineReducers({
    ranking: users,
    rewards,
  })
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
