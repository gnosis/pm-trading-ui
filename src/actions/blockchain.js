import {
  initGnosisConnection,
  getCurrentBalance,
  getCurrentAccount,
  calcMarketGasCost,
  calcBuySharesGasCost,
  calcSellSharesGasCost,
  calcCategoricalEventGasCost,
  calcScalarEventGasCost,
  calcCentralizedOracleGasCost,
  calcFundingGasCost,
  getGasPrice,
  getEtherTokens,
} from 'api'

import { timeoutCondition, getGnosisJsOptions } from 'utils/helpers'
import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'
import { findDefaultProvider } from 'selectors/blockchain'

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setActiveProvider = createAction('SET_ACTIVE_PROVIDER')
export const setGasCost = createAction('SET_GAS_COST')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const registerProvider = createAction('REGISTER_PROVIDER')
export const updateProvider = createAction('UPDATE_PROVIDER')
export const setEtherTokens = createAction('SET_ETHER_TOKENS')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestGasCost = contractType => async (dispatch) => {
  if (contractType === GAS_COST.MARKET_CREATION) {
    calcMarketGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.BUY_SHARES) {
    calcBuySharesGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SELL_SHARES) {
    calcSellSharesGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CATEGORICAL_EVENT) {
    calcCategoricalEventGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SCALAR_EVENT) {
    calcScalarEventGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CENTRALIZED_ORACLE) {
    calcCentralizedOracleGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.FUNDING) {
    calcFundingGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  }
}

export const requestEtherTokens = account => async (dispatch) => {
  const etherTokens = await getEtherTokens(account)
  dispatch(setEtherTokens({ entityType: 'etherTokens', account, etherTokens }))
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

    await dispatch(setActiveProvider(newProvider.name))

    // init Gnosis connection
    const opts = getGnosisJsOptions(newProvider.name)
    await initGnosisConnection(opts)
    await dispatch(setGnosisInitialized({ initialized: true }))
    await requestEtherTokens()
  } catch (error) {
    console.warn(`Gnosis.js initialization Error: ${error}`)
    return await dispatch(setGnosisInitialized({ initialized: false, error }))
  }

  // connect
  try {
    // runs test executions on gnosisjs
    const getConnection = async () => {
      const account = await getCurrentAccount()
      await getCurrentBalance(account)
    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
    return await dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.warn(`Gnosis.js connection Error: ${error}`)
    return await dispatch(setConnectionStatus({ connected: false }))
  }
}
