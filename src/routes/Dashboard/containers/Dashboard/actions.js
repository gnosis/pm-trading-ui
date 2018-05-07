import { push } from 'react-router-redux'
import { fetchMarkets } from 'store/actions/market'
import { requestShares, requestTrades } from '../../store/actions'

export default {
  requestShares,
  requestTrades,
  fetchMarkets,
  viewMarket: address => push(`/markets/${address}`),
}
