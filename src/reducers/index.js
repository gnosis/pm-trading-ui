import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import entities from './entities'
import accountReducer from './AccountReducer'
import walletReducer from './WalletReducer'

const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  account: accountReducer,
  wallet: walletReducer,
  entities,
})

/*
const rootReducer = (state, action) => {
  let resultState = state
  if (action.type === 'LOGOUT') {
    resultState = undefined
  }
  return reducers(resultState, action)
}
*/

export default reducers
