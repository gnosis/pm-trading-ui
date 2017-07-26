import { getCurrentAccount } from 'api'

import { hexWithoutPrefix } from 'utils/helpers'
import { createAction } from 'redux-actions'

export const setDefaultAccount = createAction('SET_DEFAULT_ACCOUNT')

export const connectBlockchain = () => async (dispatch) => {
  const account = await getCurrentAccount()

  return await dispatch(setDefaultAccount(hexWithoutPrefix(account)))
}