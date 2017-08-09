import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import entities from './entities'
import modal from './modal'
import transactions from './transactions'
import blockchain from './blockchain'
import settings from './settings'

const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  modal,
  entities,
  transactions,
  blockchain,
  settings
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
