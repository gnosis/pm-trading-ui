import { requestFromRestAPI } from 'api/utils/fetch'
import { extractMarkets } from 'store/actions/market/fetchMarkets'

export const getMarketById = async (marketAddress) => {
  const response = await requestFromRestAPI(`markets/${marketAddress}`)
  const processedMarkets = extractMarkets([response])

  if (processedMarkets.length !== 1) {
    throw new Error('invalid amount of market, either none of multiple')
  }

  return processedMarkets[0]
}
