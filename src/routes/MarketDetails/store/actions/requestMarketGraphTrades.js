import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processTradesResponse } from 'store/actions/trades'

export default marketAddress => async (dispatch) => {
  const normalizedMarket = hexWithoutPrefix(marketAddress)
  const response = await requestFromRestAPI(`markets/${normalizedMarket}/trades/`)

  processTradesResponse(response, dispatch)
}
