import { getCurrentAccount } from 'api'

import { hexWithoutPrefix } from 'utils/helpers'
import { createAction } from 'redux-actions'

export const setDefaultAccount = createAction('SET_DEFAULT_ACCOUNT')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')

export const connectBlockchain = () => async (dispatch) => {
  try {
    const account = await getCurrentAccount()
    await dispatch(setDefaultAccount(hexWithoutPrefix(account)))
    return await dispatch(setConnectionStatus({ connected: true }))
  } catch (e) {
    console.warn(`Blockchain connection Error: ${e}`)
    return await dispatch(setConnectionStatus({ connected: false }))
  }
}
