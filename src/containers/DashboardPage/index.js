import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import { getMarkets, getAccountShares, getAccountTrades, 
  getAccountPredictiveAssets, getAccountParticipatingInEvents } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'
import { requestMarkets, requestAccountTrades, requestAccountShares } from 'actions/market'
import { weiToEth } from 'utils/helpers'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getDefaultAccount(state)
  const accountShares = getAccountShares(state, defaultAccount)
  const accountTrades = getAccountTrades(state, defaultAccount)
  const accountPredictiveAssets = weiToEth(getAccountPredictiveAssets(state, defaultAccount))
  const accountParticipatingInEvents = getAccountParticipatingInEvents(state, defaultAccount).length

  return {
    defaultAccount,
    markets,
    accountShares,
    accountTrades,
    accountPredictiveAssets,
    accountParticipatingInEvents,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
