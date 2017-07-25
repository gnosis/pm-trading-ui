import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'

import MarketDetail from 'components/MarketDetail'

import { buyMarketShares, requestMarketList } from 'actions/market'
import { resolveOracle } from 'actions/oracle'
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
  resolveOracle: (oracle, outcomeIndex) => dispatch(resolveOracle(oracle, outcomeIndex)),
  changeUrl: (url) => dispatch(replace(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
