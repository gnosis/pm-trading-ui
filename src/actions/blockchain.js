import {
  initGnosisConnection,
  getCurrentBalance,
  getCurrentAccount,
  getGasPrice,
  getTokenSymbol,
  getTokenBalance,
  initReadOnlyGnosisConnection,
} from 'api'
import Web3 from 'web3'

import { timeoutCondition, getGnosisJsOptions } from 'utils/helpers'
import { findDefaultProvider } from 'integrations/store/selectors'
import { createAction } from 'redux-actions'
import { setActiveProvider } from 'integrations/store/actions'
import { getCollateralToken, getConfiguration } from 'utils/features'

const collateralToken = getCollateralToken()
const config = getConfiguration()
const ethereumUrl = `${config.ethereum.protocol}://${config.ethereum.host}`

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const setTokenBalance = createAction('SET_TOKEN_BALANCE')
export const setTokenSymbol = createAction('SET_TOKEN_NAME')

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestTokenSymbol = tokenAddress => async (dispatch) => {
  let tokenSymbol
  try {
    tokenSymbol = await getTokenSymbol(tokenAddress)
  } catch (e) {
    tokenSymbol = ''
  } finally {
    dispatch(setTokenSymbol({ tokenAddress, tokenSymbol }))
  }
}

export const requestTokenBalance = (tokenAddress, accountAddress) => async (dispatch) => {
  const tokenBalance = await getTokenBalance(tokenAddress, accountAddress)
  dispatch(setTokenBalance({ tokenAddress, tokenBalance }))
}

/**
 * (Re)-Initializes Gnosis.js connection according to current providers settings
 */
export const initGnosis = () => async (dispatch, getState) => {
  // initialize
  let newProvider

  try {
    const state = getState()

    // determine new provider
    newProvider = findDefaultProvider(state)

    if (newProvider) {
      await dispatch(setActiveProvider(newProvider.name))
      // init Gnosis connection

      const opts = getGnosisJsOptions(newProvider)
      await initGnosisConnection(opts)
      await dispatch(setGnosisInitialized({ initialized: true }))

      if (newProvider.account) {
        await getTokenBalance(collateralToken.address, await getCurrentAccount())
      }
    }
  } catch (error) {
    console.warn(`Gnosis.js initialization Error: ${error}`)
    dispatch(setConnectionStatus({ connected: false }))
    return dispatch(setGnosisInitialized({ initialized: false, error }))
  }

  if (newProvider) {
    // connect
    try {
      // runs test executions on gnosisjs
      const getConnection = async () => {
        // these throw if they're not available, meaning we don't have a connection
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
}

export const initReadOnlyGnosis = () => async () => {
  // initialize
  try {
    await initReadOnlyGnosisConnection({
      ethereum: new Web3(new Web3.providers.HttpProvider(ethereumUrl)).currentProvider,
    })
  } catch (error) {
    console.error(`Gnosis.js RO initialization Error: ${error}`)
  }
}
