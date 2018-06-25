import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_SHARE, REDEEM_MARKET_SHARE } from 'store/actions/shares'

export default handleActions(
  {
    [ADD_MARKET_SHARE]: (state, { payload }) => Map().withMutations((map) => {
      payload.forEach(share => map.set(share.id, share))
    }),
    [REDEEM_MARKET_SHARE]: (state, { payload: shareId }) => state.setIn([shareId, 'balance'], '0'),
  },
  Map(),
)
