import * as api from 'api'
import Decimal from 'decimal.js'

const buyShares = async (
  market,
  outcomeTokenIndex,
  outcomeTokenCount,
  cost,
  approvalResetAmount,
  neededDepositAmount,
) => {
  const gnosis = await api.getGnosisConnection()

  // Markets on Gnosis has by default Ether Token as collateral Token, that has 18 decimals
  // Outcome tokens have also 18 decimals
  // The decimal values represent an offset of 18 positions on the integer value
  const collateralTokenWei = Decimal(cost)
    .mul(1e18)
    .toString()

  // The user needs to deposit amount of collateral tokens willing to pay before performing the buy
  const collateralToken = await gnosis.contracts.HumanFriendlyToken.at(await gnosis.contracts.Event.at(market.event.address).collateralToken())

  const collateralTokenName = await collateralToken.name()

  if ((collateralTokenName === 'Ether Token' || collateralTokenName === 'Wrapped Ether') && neededDepositAmount.gt(0)) {
    await gnosis.etherToken.deposit({ value: neededDepositAmount.toString() })
  }

  // buyOutComeTokens handles approving
  const collateralTokensPaid = await gnosis.buyOutcomeTokens({
    market: market.address,
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCount.toString(),
    cost: collateralTokenWei,
    approvalResetAmount,
  })

  return collateralTokensPaid
}

export default buyShares
