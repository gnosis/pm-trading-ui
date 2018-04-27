import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_MARKET_LIST } from 'routes/MarketList/store/actions/addMarkets'

export const REDUCER_ID = 'marketList'

export default handleActions(
  {
    [ADD_MARKET_LIST]: (state, { payload }) => {
      console.log(payload)
      return Map().withMutations((map) => {
        payload.forEach(market => map.set(market.address, market))
      })
    },
  },
  Map(),
)
