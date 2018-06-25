import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processSharesResponse } from 'store/actions/shares'

export default (marketAddress, account) => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const normalizedMarket = hexWithoutPrefix(marketAddress)
  const response = await requestFromRestAPI(`/market/${normalizedMarket}/shares/${normalizedAccount}`)

  processSharesResponse(response, dispatch)
}
