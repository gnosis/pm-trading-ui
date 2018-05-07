import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'

const processSharesResponse = (dispatch, response) => {
  if (response && response.results.length) {

  }
}

export default account => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const response = await requestFromRestAPI(`account/${normalizedAccount}/shares`)

  return dispatch(processSharesResponse(response))
}
