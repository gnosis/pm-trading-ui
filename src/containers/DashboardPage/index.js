import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import { getMarkets, getAccountShares } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'
import { requestMarkets, requestAccountTrades, requestAccountShares } from 'actions/market'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getDefaultAccount(state)
  const accountShares = getAccountShares(state, defaultAccount)

  return {
    defaultAccount,
    markets,
    accountShares,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
