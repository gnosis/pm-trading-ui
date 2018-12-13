import { requestFromRestAPI } from 'api/utils/fetch'
import builderFunctions from './marketBuilders'

const extractMarkets = markets => markets.map((market) => {
  const marketType = market.event.type

  const builder = builderFunctions[marketType]

  if (!builder) {
    throw new Error(`No builder function associated with type '${marketType}'`)
  }

  return builder.call(builder, market)
})

export const getMarketById = async (marketAddress) => {
  const response = await requestFromRestAPI(`markets/${marketAddress}`)
  const processedMarkets = extractMarkets([response])

  return processedMarkets[0]
}
