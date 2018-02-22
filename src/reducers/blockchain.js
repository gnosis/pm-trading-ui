import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import { setConnectionStatus, setGnosisInitialized, setGasCost, setGasPrice, setEtherTokens } from 'actions/blockchain'

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
    [setGasCost]: (state, { payload: { entityType, gasCost } }) => state.setIn(['gasCosts', entityType], gasCost),
    [setGasPrice]: (state, { payload: { entityType, gasPrice } }) => state.set(entityType, gasPrice),
    [setEtherTokens]: (state, { payload: { entityType, account, etherTokens } }) =>
      state.setIn([entityType, account], etherTokens),
  },
  Map({
    gasCosts: Object.keys(GAS_COST).reduce((acc, item) => acc.set(GAS_COST[item], undefined), Map()),
    gasPrice: Decimal(0),
    connection: undefined,
    connectionTried: false,
    etherTokens: Map(),
  }),
)

export default reducer
