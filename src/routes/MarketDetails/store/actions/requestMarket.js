import { requestFromRestAPI } from 'api/utils/fetch'
import addMarkets from 'store/actions/market/addMarkets'
import { getCollateralToken } from 'store/selectors/blockchain'
import { hexWithoutPrefix } from 'utils/helpers'
import { extractMarkets } from 'store/actions/market'

export const processMarketResponse = (dispatch, state, response) => {
  if (!response) {
    dispatch(addMarkets([]))
    return
  }

  const applicationCollateralToken = getCollateralToken(state)

  let marketRecords = extractMarkets([response])

  if (applicationCollateralToken.address) {
    marketRecords = marketRecords.filter(({ collateralToken }) => collateralToken === hexWithoutPrefix(applicationCollateralToken.address))
  }

  dispatch(addMarkets(marketRecords))
}

export default marketAddress => async (dispatch, getState) => {
  const response = await requestFromRestAPI(`markets/${marketAddress}`)
  const state = getState()

  return processMarketResponse(dispatch, state, response)
}
