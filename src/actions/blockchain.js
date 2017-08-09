import { getCurrentAccount } from 'api'

import { hexWithPrefix, timeoutCondition } from 'utils/helpers'
import { createAction } from 'redux-actions'

export const setDefaultAccount = createAction('SET_DEFAULT_ACCOUNT')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const connectBlockchain = () => async (dispatch) => {
  try {
    let account
    const getConnection = async () => {
      account = await getCurrentAccount()
    }

    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
    await dispatch(setDefaultAccount(hexWithPrefix(account)))
    return await dispatch(setConnectionStatus({ connected: true }))
  } catch (e) {
    console.warn(`Blockchain connection Error: ${e}`)
    return await dispatch(setConnectionStatus({ connected: false }))
  }
}
