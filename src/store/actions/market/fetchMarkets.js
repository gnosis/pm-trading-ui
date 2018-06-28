import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix, add0xPrefix } from 'utils/helpers'
import { getConfiguration } from 'utils/features'
import { getCollateralToken } from 'store/selectors/blockchain'
import builderFunctions from 'store/actions/market/utils/marketBuilders'
import addMarkets from './addMarkets'

const config = getConfiguration()
const whitelisted = config.whitelist || {}
const hiddenMarkets = config.hiddenMarkets || []

const addresses = Object.keys(whitelisted).map(hexWithoutPrefix)

export const extractMarkets = markets => markets.map((market) => {
  const marketType = market.event.type

  const builder = builderFunctions[marketType]

  if (!builder) {
    throw new Error(`No builder function associated with type '${marketType}'`)
  }

  return builder.call(builder, market)
})

export const processMarketsResponse = (dispatch, state, response) => {
  if (!response || !response.results) {
    dispatch(addMarkets([]))
    return
  }

  const applicationCollateralToken = getCollateralToken(state)

  let marketRecords = extractMarkets(response.results)

  if (applicationCollateralToken.address) {
    marketRecords = marketRecords.filter(({ collateralToken }) => collateralToken === hexWithoutPrefix(applicationCollateralToken.address))
  }

  if (hiddenMarkets.length > 0) {
    marketRecords = marketRecords.filter(market => !hiddenMarkets.find(hiddenMarketAddress => hiddenMarketAddress === add0xPrefix(market.address)))
  }

  dispatch(addMarkets(marketRecords))
}

export default () => async (dispatch, getState) => {
  const response = await requestFromRestAPI('markets', { creator: addresses.join() })
  const state = getState()

  return processMarketsResponse(dispatch, state, response)
}
