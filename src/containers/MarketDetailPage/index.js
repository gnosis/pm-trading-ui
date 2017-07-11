import { connect } from 'react-redux'

import MarketDetail from 'components/MarketDetail'

import { buyShares } from 'actions/gnosis'
import { requestMarketList } from 'actions/market'
import { getMarketById } from 'selectors/market'

const mapStateToProps = (state, ownProps) => ({
  market: getMarketById(state)(ownProps.params.id),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestMarket: () => dispatch(requestMarketList(ownProps.params.id)),
  buyShares: (market, outcome, amount) => dispatch(buyShares(market, outcome, amount)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
