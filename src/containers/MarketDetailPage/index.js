import { connect } from 'react-redux'

import MarketDetail from 'components/MarketDetail'

import { requestMarketList } from 'actions/market'
import { getMarketById } from 'selectors/market'

const mapStateToProps = (state, ownProps) => ({
  market: getMarketById(state)(ownProps.params.id),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestMarket: () => dispatch(requestMarketList(ownProps.params.id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
