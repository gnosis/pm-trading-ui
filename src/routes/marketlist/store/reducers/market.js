import { List } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_LIST } from '../actions'
import { MarketListRecord } from '../models'

export default handleActions({
  [ADD_MARKET_LIST]: (state, { payload }) =>
    state.set('marketList', List(payload)),
}, new MarketListRecord())

