import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_LIST } from 'routes/marketlist/store/actions/addMarkets'

export const REDUCER_ID = 'marketList'

/*
export default handleActions({
  [ADD_MARKET_LIST]: (state, { payload }) =>
    List(payload),
}, List([]))
*/

export default handleActions({
  [ADD_MARKET_LIST]: (state, { payload }) =>
    state.withMutations((map) => {
      payload.forEach(market =>
        map.set(market.address, market))
    }),
}, Map())
