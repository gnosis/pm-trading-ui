import {
  getCurrentAccount, calcMarketGasCost, calcBuySharesGasCost,
  calcSellSharesGasCost, calcCategoricalEventGasCost, calcScalarEventGasCost,
  calcCentralizedOracleGasCost, calcFundingGasCost, getGasPrice,
} from 'api'

import { hexWithPrefix, timeoutCondition } from 'utils/helpers'
import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'

export const setDefaultAccount = createAction('SET_DEFAULT_ACCOUNT')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasCost = createAction('SET_GAS_COST')
export const setGasPrice = createAction('SET_GAS_PRICE')

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

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestGasCost = contractType => async (dispatch) => {
  if (contractType === GAS_COST.MARKET_CREATION) {
    calcMarketGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.BUY_SHARES) {
    calcBuySharesGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SELL_SHARES) {
    calcSellSharesGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CATEGORICAL_EVENT) {
    calcCategoricalEventGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SCALAR_EVENT) {
    calcScalarEventGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CENTRALIZED_ORACLE) {
    calcCentralizedOracleGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.FUNDING) {
    calcFundingGasCost().then((gasCost) => {
      console.log('GasCost:', gasCost)
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  }
}
