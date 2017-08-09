import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import { getMarkets } from 'selectors/market'
import { requestMarkets } from 'actions/market'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  return {
    markets,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarkets()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
