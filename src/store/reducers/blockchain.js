import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import {
  setConnectionStatus,
  setGnosisInitialized,
  setGasPrice,
  setTokenSymbol,
  setTokenBalance,
} from 'store/actions//blockchain'
import { setGasCost } from 'routes/MarketDetails/store/actions'

import { GAS_COST } from 'utils/constants'
import Decimal from 'decimal.js'

const reducer = handleActions(
  {
    [setConnectionStatus]: (state, { payload: { connection } }) =>
      state.withMutations((stateMap) => {
        stateMap.set('connection', connection)
        stateMap.set('connectionTried', true)
      }),
    [setGnosisInitialized]: (state, { payload: { initialized } }) => state.set('gnosisInitialized', initialized),
    [setGasCost]: (state, { payload: { contractType, gasCost } }) => state.setIn(['gasCosts', contractType], gasCost),
    [setGasPrice]: (state, { payload: { entityType, gasPrice } }) => state.set(entityType, gasPrice),
    [setTokenSymbol]: (state, { payload: { tokenAddress, tokenSymbol } }) =>
      state.setIn(['tokenSymbols', tokenAddress], tokenSymbol),
    [setTokenBalance]: (state, { payload: { tokenAddress, tokenBalance } }) =>
      state.setIn(['tokenBalances', tokenAddress], tokenBalance),
  },
  Map({
    gasCosts: Object.keys(GAS_COST).reduce((acc, item) => acc.set(GAS_COST[item], '0'), Map()),
    gasPrice: Decimal(0),
    connection: undefined,
    connectionTried: false,
    tokenSymbols: Map(),
    tokenBalances: Map(),
  }),
)

export default reducer
