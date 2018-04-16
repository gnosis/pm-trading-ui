import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_USERS } from '../actions'
import { UserRecord } from '../models'

export default handleActions(
  {
    [ADD_USERS]: (state, { payload }) =>
      state.withMutations((map) => {
        payload.forEach(user => map.set(user.account, new UserRecord(user)))
      }),
  },
  Map(),
)
