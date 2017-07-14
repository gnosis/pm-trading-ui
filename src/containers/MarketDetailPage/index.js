import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import MarketDetail from 'components/MarketDetail'

import { buyMarketShares } from 'actions/market'
import { requestMarketList } from 'actions/market'
import { getMarketById } from 'selectors/market'

const mapStateToProps = (state, ownProps) => {
  const marketBuySelector = formValueSelector('marketBuyShares')
  return {
    market: getMarketById(state)(ownProps.params.id),
    selectedCategoricalOutcome: marketBuySelector(state, 'selectedOutcome'),
    selectedBuyInvest: marketBuySelector(state, 'invest'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestMarket: () => dispatch(requestMarketList(ownProps.params.id)),
  buyShares: (market, outcomeIndex, amount) => dispatch(buyMarketShares(market, outcomeIndex, amount)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
