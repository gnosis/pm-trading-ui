import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { addMarkets, updateMarket } from 'store/actions/market'

export default handleActions(
  {
    [addMarkets]: (state, { payload }) => state.withMutations((map) => {
      payload.forEach(market => map.set(market.address, market))
    }),
    [updateMarket]: (state, { payload: { marketAddress, data } }) => state.mergeIn([marketAddress], data),
  },
  Map(),
)
