import { push, replace } from 'react-router-redux'
import { fetchMarkets } from 'store/actions/market'
import redeemMarket from 'store/actions/market/redeemMarket'
import { requestTrades } from 'store/actions/trades'
import { requestShares } from 'store/actions/shares'
import { fetchTournamentUserData } from 'routes/Scoreboard/store'

export default {
  requestShares,
  requestTrades,
  fetchMarkets,
  fetchTournamentUserData,
  viewMarket: address => push(`/markets/${address}`),
  viewMarketList: () => replace('/markets/list'),
  redeemWinnings: market => redeemMarket(market),
}
