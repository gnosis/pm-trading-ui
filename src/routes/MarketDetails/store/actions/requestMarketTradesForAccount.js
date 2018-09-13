import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processTradesResponse } from 'store/actions/trades'

export default (marketAddress, account) => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const normalizedMarket = hexWithoutPrefix(marketAddress)
  const response = await requestFromRestAPI(`/markets/${normalizedMarket}/trades/${normalizedAccount}`)
  processTradesResponse(response, dispatch)
}
