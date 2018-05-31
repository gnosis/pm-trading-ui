import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_TRADE } from 'store/actions/trades'

export default handleActions({
  [ADD_MARKET_TRADE]: (state, { payload }) =>
    Map().withMutations((map) => {
      payload.forEach(trade =>
        map.set(trade.id, trade))
    }),
}, Map())
