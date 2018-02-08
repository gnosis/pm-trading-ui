import { List } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_LIST } from '../actions'

export const REDUCER_ID = 'marketList'

export default handleActions({
  [ADD_MARKET_LIST]: (state, { payload }) =>
    state.set(List(payload)),
}, List([]))

