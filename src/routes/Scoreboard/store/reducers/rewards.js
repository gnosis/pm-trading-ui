import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { loadStorage } from 'store/middlewares/Storage'
import { rewardsClaimed } from '../actions'

export default handleActions(
  {
    [rewardsClaimed]: state => state.set('rewardsClaimed', true),
    [loadStorage]: (state, { payload }) => {
      if (payload?.tournament?.rewards) {
        return state.set('rewardsClaimed', payload.tournament.rewards.rewardsClaimed)
      }
      return state
    },
  },
  Map({
    rewardsClaimed: false,
  }),
)
