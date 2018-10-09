import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import {
  setConnectionStatus,
  setGnosisInitialized,
  setGnosisROInitialized,
  setGasPrice,
  setTokenSymbol,
  setTokenBalance,
  setCollateralToken,
  ETH_TOKEN_ICON,
} from 'store/actions/blockchain'

import { setGasCost } from 'routes/MarketDetails/store/actions'

import { GAS_COST } from 'utils/constants'

const reducer = handleActions(
  {
    [setConnectionStatus]: (state, { payload: { connection } }) => state.withMutations((stateMap) => {
      stateMap.set('connection', connection)
      stateMap.set('connectionTried', true)
    }),
    [setGnosisInitialized]: (state, { payload: { initialized } }) => state.set('gnosisInitialized', initialized),
    [setGnosisROInitialized]: (state, { payload: { initialized } }) => state.set('gnosisROInitialized', initialized),
    [setGasCost]: (state, { payload: { contractType, gasCost } }) => state.setIn(['gasCosts', contractType], gasCost),
    [setGasPrice]: (state, { payload: { entityType, gasPrice } }) => state.set(entityType, gasPrice),
    [setTokenSymbol]: (state, { payload: { tokenAddress, tokenSymbol } }) => state.setIn(['tokenSymbols', tokenAddress], tokenSymbol),
    [setTokenBalance]: (state, { payload: { tokenAddress, tokenBalance } }) => state.setIn(['tokenBalances', tokenAddress], tokenBalance),
    [setCollateralToken]: (state, {
      payload: {
        address, symbol, icon, source, isWrappedEther,
      },
    }) => state.set(
      'collateralToken',
      Map({
        address,
        symbol,
        icon,
        source,
        isWrappedEther,
      }),
    ),
  },
  Map({
    gasCosts: Object.keys(GAS_COST).reduce((acc, item) => acc.set(GAS_COST[item], undefined), Map()),
    gasPrice: undefined,
    connection: undefined,
    gnosisInitialized: false,
    gnosisROInitialized: false,
    tokenSymbols: Map(),
    tokenBalances: Map(),
    collateralToken: Map({
      source: undefined,
      address: undefined,
      symbol: '/',
      icon: ETH_TOKEN_ICON,
    }),
  }),
)

export default reducer
