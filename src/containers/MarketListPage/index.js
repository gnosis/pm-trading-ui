import { connect } from 'react-redux'

import MarketList from 'components/MarketList'
import { getMarkets } from 'selectors/market'
import { requestMarketList } from 'actions/market'

const mapStateToProps = (state) => ({
  markets: getMarkets(state),
})

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarketList())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
