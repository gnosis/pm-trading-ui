import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_SHARE } from '../actions'

export default handleActions({
  [ADD_MARKET_SHARE]: (state, { payload }) =>
    Map().withMutations((map) => {
      payload.forEach(share =>
        map.set(share.id, share))
    }),
}, Map())
