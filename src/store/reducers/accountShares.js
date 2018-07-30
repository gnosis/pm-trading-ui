import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { addShare, updateShare, redeemShare } from 'store/actions/shares'

export default handleActions(
  {
    [addShare]: (state, { payload }) => state.withMutations((map) => {
      payload.forEach(share => map.set(share.id, share))
    }),
    [redeemShare]: (state, { payload: shareId }) => state.setIn([shareId, 'balance'], '0'),
    [updateShare]: (state, { payload: { shareId, data } }) => state.mergeIn([shareId], data),
  },
  Map(),
)
