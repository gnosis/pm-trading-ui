import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { isFeatureEnabled } from 'utils/features'

// Reducers
import integrations from 'integrations/store/reducers'
import users from 'routes/Scoreboard/store/reducers/users'
import rewards from 'routes/Scoreboard/store/reducers/rewards'
import transactions from 'routes/Transactions/store/reducers/transactions'
import modal from './modal'
import blockchain from './blockchain'
import notifications from './notifications'
import marketList from './market'
import accountShares from './accountShares'
import accountTrades from './accountTrades'

const tournamentEnabled = isFeatureEnabled('tournament')

const reducers = {
  routing: routerReducer,
  form: formReducer,
  modal,
  transactions,
  blockchain,
  notifications,
  integrations,
  marketList,
  accountShares,
  accountTrades,
}

if (tournamentEnabled) {
  reducers.tournament = combineReducers({
    ranking: users,
    rewards,
  })
}

export default combineReducers(reducers)
