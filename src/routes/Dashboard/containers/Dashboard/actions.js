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
  redeemWinnings: market => redeemMarket(market),
}
