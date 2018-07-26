import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_ACCOUNT_TRADE } from 'store/actions/trades'

export default handleActions(
  {
    [ADD_ACCOUNT_TRADE]: (state, { payload }) => Map().withMutations((map) => {
      payload.forEach(trade => map.set(trade.id, trade))
    }),
  },
  Map(),
)
