import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'
import { calcBuySharesGasCost, calcSellSharesGasCost, calcRedeemWinningsGasCost } from '../../api'

const setGasCost = createAction('SET_GAS_COST')

const requestGasCost = (contractType, opts) => async (dispatch) => {
  if (contractType === GAS_COST.BUY_SHARES) {
    const gasCost = await calcBuySharesGasCost()
    dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
  } else if (contractType === GAS_COST.SELL_SHARES) {
    const gasCost = await calcSellSharesGasCost()
    dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
  } else if (contractType === GAS_COST.REDEEM_WINNINGS) {
    const gasCost = await calcRedeemWinningsGasCost(opts)
    dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
  }
}

export { requestGasCost, setGasCost }
