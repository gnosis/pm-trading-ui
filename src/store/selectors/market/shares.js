import { getCollateralToken } from 'store/selectors/blockchain'
import { List } from 'immutable'
import { normalizeHex } from 'utils/helpers'

export const sharesForMarketSelector = (state, marketAddress) => {
  const collateralToken = getCollateralToken(state)
  const market = state.marketList.get(marketAddress)

  if (market) {
    const marketShares = state.accountShares.filter(
      marketShare => normalizeHex(marketShare.eventAddress) === normalizeHex(market.eventAddress)
        && normalizeHex(marketShare.collateralTokenAddress) === normalizeHex(collateralToken.address),
    )

    return List(marketShares.values())
  }

  return List()
}
