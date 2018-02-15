import Decimal from 'decimal.js'
import { calcShareWinnings } from 'containers/DashboardPage/store/selectors/utils'

const calculateProfit = (share) => {
  if (share.isResolved) {
    return calcShareWinnings(share, share.market, share.market.event)
  }
  return new Decimal(share.balance).mul(share.marginalPrice)
}

export default calculateProfit
