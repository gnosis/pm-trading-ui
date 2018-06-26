import { getCurrentAccount } from 'integrations/store/selectors'
import Decimal from 'decimal.js'
import { List } from 'immutable'
import { createSelector } from 'reselect'
import { sharesWithMarketsSelector } from 'store/selectors/account/shares'
import { hexWithoutPrefix } from '../../../../utils/helpers'

const getMarketShares = marketAddress => createSelector(sharesWithMarketsSelector, getCurrentAccount, (shares, account) => List(
  shares.filter(
    share => Decimal(share.balance).gt(0)
          && share.owner === hexWithoutPrefix(account)
          && share.market.address === marketAddress,
  ),
))

export default getMarketShares
