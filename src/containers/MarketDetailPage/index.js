import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'
import { requestGasCost, requestGasPrice } from 'actions/blockchain'
import MarketDetail from 'components/MarketDetail'

import {
  buyMarketShares,
  sellMarketShares,
  requestMarketShares,
  requestMarket,
  requestMarketTrades,
  requestMarketTradesForAccount,
  resolveMarket,
  redeemWinnings,
  withdrawFees,
  closeMarket,
} from 'actions/market'
import { getMarketById } from 'selectors/market'
import { getMarketTradesForAccount } from 'selectors/marketTrades'
import { getMarketShares } from 'selectors/marketShares'
import { getMarketGraph } from 'selectors/marketGraph'
import {
  getCurrentAccount,
  getCurrentBalance,
  getGasCosts,
  getGasPrice,
  isGasCostFetched,
  isGasPriceFetched,
  checkWalletConnection,
} from 'selectors/blockchain'
import { isModerator, getModerators } from 'utils/helpers'

const mapStateToProps = (state, ownProps) => {
  const market = getMarketById(state)(ownProps.params.id)

  if (!Object.keys(market).length) {
    return { market }
  }

  const marketGraph = getMarketGraph(market)(state)
  const marketBuySelector = formValueSelector('marketBuyShares')
  const marketMySharesSelector = formValueSelector('marketMyShares')
  const marketShortSellSelector = formValueSelector('marketShortSell')
  const defaultAccount = getCurrentAccount(state)
  const marketTrades = getMarketTradesForAccount(market.address, defaultAccount)(state)

  return {
    market,
    defaultAccount,
    marketShares: getMarketShares(market.address)(state),
    selectedOutcome: marketBuySelector(state, 'selectedOutcome'),
    selectedBuyInvest: marketBuySelector(state, 'invest'),
    limitMargin: marketBuySelector(state, 'limitMargin'),
    selectedSellAmount: marketMySharesSelector(state, 'sellAmount'),
    selectedShortSellAmount: marketShortSellSelector(state, 'shortSellAmount'),
    selectedShortSellOutcome: marketShortSellSelector(state, 'selectedOutcome'),
    hasWallet: checkWalletConnection(state),
    isConfirmedSell: marketMySharesSelector(state, 'confirm'),
    creatorIsModerator: isModerator(getCurrentAccount(state)),
    moderators: getModerators(),
    marketTrades,
    marketGraph,
    initialValues: {
      selectedOutcome: 0,
    },
    isGasCostFetched: property => isGasCostFetched(state, property),
    isGasPriceFetched: isGasPriceFetched(state),
    gasCosts: getGasCosts(state),
    gasPrice: getGasPrice(state),
    currentBalance: getCurrentBalance(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMarket: () => dispatch(requestMarket(ownProps.params.id)),
  fetchMarketShares: accountAddress => dispatch(requestMarketShares(ownProps.params.id, accountAddress)),
  fetchMarketTradesForAccount: (marketAddress, accountAddress) =>
    dispatch(requestMarketTradesForAccount(marketAddress, accountAddress)),
  fetchMarketTrades: market => dispatch(requestMarketTrades(market)),
  buyShares: (market, outcomeIndex, outcomeTokenCount, cost) =>
    dispatch(buyMarketShares(market, outcomeIndex, outcomeTokenCount, cost)),
  sellShares: (market, outcomeIndex, outcomeTokenCount, earnings) =>
    dispatch(sellMarketShares(market, outcomeIndex, outcomeTokenCount, earnings)),
  resolveMarket: (market, outcomeIndex) => dispatch(resolveMarket(market, outcomeIndex)),
  changeUrl: url => dispatch(replace(url)),
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  withdrawFees: market => dispatch(withdrawFees(market)),
  requestGasCost: (contractType, opts) => dispatch(requestGasCost(contractType, opts)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  closeMarket: market => dispatch(closeMarket(market)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
