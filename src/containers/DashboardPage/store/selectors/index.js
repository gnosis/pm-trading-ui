import { createSelector } from 'reselect'
import { Decimal } from 'decimal.js'
import { values } from 'lodash'
import { getAccountShares } from 'store/selectors/marketShares'
import { getCurrentAccount } from 'integrations/store/selectors/'
import { calculateProfit } from 'containers/DashboardPage/store/selectors/utils'

export const profitsSelector = createSelector(getCurrentAccount, getAccountShares, (account, accountShares) => {
  const minProfit = Decimal(0)

  if (!account) {
    return minProfit
  }

  const shares = values(accountShares)
  return shares.length ? shares.reduce((assets, share) => assets.add(calculateProfit(share)), minProfit) : minProfit
})
