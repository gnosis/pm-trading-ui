import * as api from 'api'
import Decimal from 'decimal.js'
import { hexWithPrefix } from 'utils/helpers'

const sellShares = async (marketAddress, outcomeTokenIndex, outcomeTokenCount, earnings, approvalResetAmount) => {
  const gnosis = await api.getGnosisConnection()

  const outcomeTokenCountWei = Decimal(outcomeTokenCount)
    .mul(1e18)
    .toString()
  const minProfit = Decimal(earnings)
    .mul(1e18)
    .round()
    .toString()

  const collateralTokensReceived = await gnosis.sellOutcomeTokens({
    market: hexWithPrefix(marketAddress),
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCountWei,
    minProfit,
    approvalResetAmount,
  })

  return collateralTokensReceived
}

export default sellShares
