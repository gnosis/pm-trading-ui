import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { addTradesForGraph } from 'routes/MarketDetails/store/actions'

export default handleActions(
  {
    [addTradesForGraph]: (
      state,
      {
        payload: {
          market: { address },
          trades,
        },
      },
    ) => state.set(address, trades),
  },
  Map({
    trades: Map(),
  }),
)
