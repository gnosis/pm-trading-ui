import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_LIST } from 'store/actions/market/addMarkets'

export default handleActions(
  {
    [ADD_MARKET_LIST]: (state, { payload }) =>
      Map().withMutations((map) => {
        payload.forEach(market => map.set(market.address, market))
      }),
  },
  Map(),
)
