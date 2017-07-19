import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import { getMarkets } from 'selectors/market'
import { requestMarketList } from 'actions/market'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  return {
    markets: markets,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarketList()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
