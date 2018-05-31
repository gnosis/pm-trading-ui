import { push, replace } from 'react-router-redux'
import { fetchMarkets } from 'store/actions/market'
import { requestTrades } from 'store/actions/trades'
import { requestShares } from 'store/actions/shares'

export default {
  requestShares,
  requestTrades,
  fetchMarkets,
  viewMarket: address => push(`/markets/${address}`),
  viewMarketList: () => replace('/markets/list'),
}
