import { List } from 'immutable'
import { createSelector } from 'reselect'
import Decimal from 'decimal.js'

const shareSelector = createSelector(
  state => state.marketShares,
  shares => List(shares
    .filter(share => Decimal(share.balance).gt(0))
    .sortBy(share => share.marketResolution).values()),
)

export default shareSelector
