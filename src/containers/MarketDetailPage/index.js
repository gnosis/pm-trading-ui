import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'

import MarketDetail from 'components/MarketDetail'

import {
  buyMarketShares,
  sellMarketShares,
  requestMarketShares,
  requestMarket,
  requestMarketParticipantTrades,
  resolveMarket,
  redeemWinnings,
  withdrawFees,
} from 'actions/market'
import { getMarketById, getMarketSharesByMarket, getMarketParticipantsTrades } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'
import { getIsModerator } from 'selectors/settings'

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
    isConfirmed: marketBuySelector(state, 'confirm'),
    isConfirmedSell: marketMySharesSelector(state, 'confirm'),
    defaultAccount: getDefaultAccount(state),
    isModerator: getIsModerator(state, getDefaultAccount(state)),
    trades: getMarketParticipantsTrades(state)(),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMarket: () => dispatch(requestMarket(ownProps.params.id)),
  fetchMarketShares: accountAddress => dispatch(requestMarketShares(ownProps.params.id, accountAddress)),
  fetchMarketParticipantTrades: (marketAddress, accountAddress) =>
    dispatch(requestMarketParticipantTrades(marketAddress, accountAddress)),
  buyShares: (market, outcomeIndex, outcomeTokenCount, cost) => dispatch(buyMarketShares(market, outcomeIndex, outcomeTokenCount, cost)),
  sellShares: (market, outcomeIndex, outcomeTokenCount) => dispatch(sellMarketShares(market, outcomeIndex, outcomeTokenCount)),
  resolveMarket: (market, outcomeIndex) => dispatch(resolveMarket(market, outcomeIndex)),
  changeUrl: url => dispatch(replace(url)),
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  withdrawFees: market => dispatch(withdrawFees(market)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
