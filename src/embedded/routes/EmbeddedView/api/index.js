import { requestFromRestAPI } from 'api/utils/fetch'
import { extractMarkets } from 'store/actions/market/fetchMarkets'

export const getMarketById = async (marketAddress) => {
  const response = await requestFromRestAPI(`markets/${marketAddress}`)
  const processedMarkets = extractMarkets([response])

  return processedMarkets[0]
}
