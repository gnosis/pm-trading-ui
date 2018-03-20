import { initGnosisConnection, getCurrentBalance, getCurrentAccount, getGasPrice, getEtherTokens, getTokenSymbol } from 'api'

import { timeoutCondition, getGnosisJsOptions } from 'utils/helpers'
import { findDefaultProvider } from 'integrations/store/selectors'
import { createAction } from 'redux-actions'
import { setActiveProvider } from 'integrations/store/actions'

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const setEtherTokens = createAction('SET_ETHER_TOKENS')
export const setTokenSymbol = createAction('SET_TOKEN_NAME')

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestEtherTokens = account => async (dispatch) => {
  const etherTokens = await getEtherTokens(account)
  dispatch(setEtherTokens({ entityType: 'etherTokens', account, etherTokens }))
}

export const requestTokenSymbol = tokenAddress => async (dispatch) => {
  const tokenSymbol = await getTokenSymbol(tokenAddress)
  dispatch(setTokenSymbol({ tokenAddress, tokenSymbol }))
}

/**
 * (Re)-Initializes Gnosis.js connection according to current providers settings
 */
export const initGnosis = () => async (dispatch, getState) => {
  // initialize
  try {
    const state = getState()

    // determine new provider
    const newProvider = findDefaultProvider(state)

    if (newProvider) {
      await dispatch(setActiveProvider(newProvider.name))
      // init Gnosis connection
      if (newProvider.account) {
        const opts = getGnosisJsOptions(newProvider)
        await initGnosisConnection(opts)
      } else {
        throw new Error('No account found')
      }

      await dispatch(setGnosisInitialized({ initialized: true }))
      await requestEtherTokens()
    }
  } catch (error) {
    console.warn(`Gnosis.js initialization Error: ${error}`)
    await dispatch(setConnectionStatus({ connected: false }))
    return dispatch(setGnosisInitialized({ initialized: false, error }))
  }

  // connect
  try {
    // runs test executions on gnosisjs
    const getConnection = async () => {
      const account = await getCurrentAccount()
      await getCurrentBalance(account)
    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
    await dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.warn(`Gnosis.js connection Error: ${error}`)
    return dispatch(setConnectionStatus({ connected: false }))
  }
}
