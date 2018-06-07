import { getCollateralToken } from 'store/selectors/blockchain'
import { List } from 'immutable'

export const sharesForMarketSelector = (state, marketAddress) => {
  const collateralToken = getCollateralToken(state)
  const market = state.marketList.get(marketAddress)

  if (market) {
    const marketShares = state.marketShares.filter(marketShare => (
      marketShare.eventAddress === market.eventAddress &&
      marketShare.collateralTokenAddress === collateralToken.address
    ))

    return marketShares
  }

  return List()
}
