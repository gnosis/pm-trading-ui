import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import entities from './entities'
import modal from './modal'
import transactions from './transactions'
import blockchain from './blockchain'
import notifications from './notifications'
import users from 'routes/scoreboard/store/reducers/users'

const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    modal,
    entities,
    transactions,
    blockchain,
    notifications,
    olympia: combineReducers({
        ranking: users,
    }),
})

const rootReducer = (state, action) => {
    let resultState = state
    if (action.type === 'LOAD_LOCALSTORAGE') {
        resultState = {
            ...state,
            ...action.payload,
        }
    }
    return reducers(resultState, action)
}

export default rootReducer
