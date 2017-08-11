import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'

import MarketDetail from 'components/MarketDetail'

import { buyMarketShares, sellMarketShares, requestMarketShares, requestMarket, requestMarketParticipantTrades } from 'actions/market'
import { resolveOracle } from 'actions/oracle'
import { getMarketById, getMarketSharesByMarket } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'

const mapStateToProps = (state, ownProps) => {
  const marketBuySelector = formValueSelector('marketBuyShares')
  const marketMySharesSelector = formValueSelector('marketMyShares')
  const marketShortSellSelector = formValueSelector('marketShortSell')

  return {
    market: getMarketById(state)(ownProps.params.id),
    marketShares: getMarketSharesByMarket(state)(ownProps.params.id, getDefaultAccount(state)),
    selectedCategoricalOutcome: marketBuySelector(state, 'selectedOutcome'),
    selectedBuyInvest: marketBuySelector(state, 'invest'),
    selectedSellAmount: marketMySharesSelector(state, 'sellAmount'),
    selectedShortSellAmount: marketShortSellSelector(state, 'shortSellAmount'),
    selectedShortSellOutcome: marketShortSellSelector(state, 'selectedOutcome'),
    defaultAccount: getDefaultAccount(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMarket: () => dispatch(requestMarket(ownProps.params.id)),
  fetchMarketShares: accountAddress => dispatch(requestMarketShares(ownProps.params.id, accountAddress)),
  fetchMarketParticipantTrades: (marketAddress, accountAddress) =>
    dispatch(requestMarketParticipantTrades(marketAddress, accountAddress)),
  buyShares: (market, outcomeIndex, amount) => dispatch(buyMarketShares(market, outcomeIndex, amount)),
  sellShares: (market, outcomeIndex, amount) => dispatch(sellMarketShares(market, outcomeIndex, amount)),
  resolveOracle: (oracle, outcomeIndex) => dispatch(resolveOracle(oracle, outcomeIndex)),
  changeUrl: url => dispatch(replace(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
