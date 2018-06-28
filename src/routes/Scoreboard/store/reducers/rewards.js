import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { loadStorage } from 'store/middlewares/Storage'
import { rewardsClaimed } from '../actions'

export default handleActions(
  {
    [rewardsClaimed]: state => state.set('rewardsClaimed', true),
    [loadStorage]: (
      state,
      {
        payload: {
          tournament: { rewards },
        },
      },
    ) => state.set('rewardsClaimed', rewards.rewardsClaimed),
  },
  Map({
    rewardsClaimed: false,
  }),
)
