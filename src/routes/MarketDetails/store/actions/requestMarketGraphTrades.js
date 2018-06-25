import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { createAction } from 'redux-actions'

export const addTradesForGraph = createAction('ADD_MARKETGRAPH_TRADES')

export default marketAddress => async (dispatch) => {
  const normalizedMarket = hexWithoutPrefix(marketAddress)
  const response = await requestFromRestAPI(`/market/${normalizedMarket}/trades/`)

  dispatch(addTradesForGraph(response))
}
