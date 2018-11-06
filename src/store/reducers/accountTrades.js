import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_ACCOUNT_TRADE } from 'store/actions/trades'

export default handleActions(
  {
    [ADD_ACCOUNT_TRADE]: (state, { payload }) => state.withMutations((stateMap) => {
      payload.forEach(trade => stateMap.set(trade.id, trade))
    }),
  },
  Map(),
)
