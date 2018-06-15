import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { rewardsClaimed } from '../actions'

export default handleActions(
  {
    [rewardsClaimed]: state => state.set('rewardsClaimed', true),
  },
  Map({
    rewardsClaimed: false,
  }),
)
