import {
  getGnosisConnection,
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
  calcRedeemWinningsGasCost,
  getGasPrice,
  getEtherTokens,
} from 'api'

import { timeoutCondition, getGnosisJsOptions, weiToEth } from 'utils/helpers'
import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'
import { findDefaultProvider, getSelectedProvider } from 'selectors/blockchain'

import { setActiveProvider } from './providers'

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasCost = createAction('SET_GAS_COST')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const setEtherTokens = createAction('SET_ETHER_TOKENS')

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestGasCost = (contractType, opts) => async (dispatch) => {
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
  } else if (contractType === GAS_COST.REDEEM_WINNINGS) {
    calcRedeemWinningsGasCost(opts).then((gasCost) => {
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
