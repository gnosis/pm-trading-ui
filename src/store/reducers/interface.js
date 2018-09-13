import { handleActions } from 'redux-actions'
import { Map } from 'immutable'

import { changeUiState } from 'store/actions/interface'

const reducer = handleActions(
  {
    [changeUiState]: (state, { payload }) => state.merge(payload),
  },
  Map({
    showIntercomReminder: false,
    showCookieBanner: false,
  }),
)

export default reducer
