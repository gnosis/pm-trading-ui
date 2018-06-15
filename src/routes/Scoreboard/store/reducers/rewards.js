import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { LOAD_LOCALSTORAGE } from 'store/middlewares/LocalStorageLoad'
import { rewardsClaimed } from '../actions'

const defaultState = Map({
  rewardsClaimed: false,
})

export default handleActions(
  {
    [rewardsClaimed]: state => state.set('rewardsClaimed', true),
    [LOAD_LOCALSTORAGE]: (
      state,
      {
        payload: {
          tournament: { rewards },
        },
      },
    ) => state.set('rewardsClaimed', rewards.rewardsClaimed),
  },
  defaultState,
)
