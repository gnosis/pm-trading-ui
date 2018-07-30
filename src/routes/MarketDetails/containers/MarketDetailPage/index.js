import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors } from 'redux-form'
import { replace } from 'react-router-redux'
import { requestGasPrice, requestTokenSymbol } from 'store/actions/blockchain'
import MarketDetail from 'routes/MarketDetails/components/MarketDetail'

import redeemMarket from 'store/actions/market/redeemMarket'
import {
  buyMarketShares,
  sellMarketShares,
  requestMarketGraphTrades,
  requestMarketSharesForAccount,
  requestMarketTradesForAccount,
  requestMarket,
  requestGasCost,
} from 'routes/MarketDetails/store/actions'
import { getMarketById } from 'store/selectors/market'
import {
  getMarketGraph,
  getMarketTradesForAccount,
  getMarketShares,
  getGasCosts,
  getGasPrice,
  isGasCostFetched,
  isGasPriceFetched,
} from 'routes/MarketDetails/store/selectors'
import {
  checkWalletConnection,
  getCurrentAccount,
  getCurrentBalance,
  getRegisteredMainnetAddress,
} from 'integrations/store/selectors'
import { isModerator, getModerators } from 'utils/helpers'
import { getTokenSymbol, getTokenAmount } from 'store/selectors/blockchain'

let marketId

const mapStateToProps = (state, ownProps) => {
  marketId = ownProps.match.params.id
  const market = getMarketById(state)(marketId)

  if (!Object.keys(market).length) {
    return { market }
  }

  const marketGraph = getMarketGraph(market)(state)
  const marketBuySelector = formValueSelector('marketBuyShares')
  const marketMySharesSelector = formValueSelector('marketMyShares')
  const defaultAccount = getCurrentAccount(state)
  const marketTrades = getMarketTradesForAccount(market.eventAddress, defaultAccount)(state)

  return {
    market,
    defaultAccount,
    marketShares: getMarketShares(market.address)(state),
    selectedOutcome: marketBuySelector(state, 'selectedOutcome'),
    selectedBuyInvest: marketBuySelector(state, 'invest'),
    limitMargin: marketBuySelector(state, 'limitMargin'),
    selectedSellAmount: marketMySharesSelector(state, 'sellAmount'),
    sellFormHasErrors: Object.keys(getFormSyncErrors('marketMyShares')(state)).length > 0,
    hasWallet: checkWalletConnection(state),
    isConfirmedSell: marketMySharesSelector(state, 'confirm'),
    isModerator: isModerator(getCurrentAccount(state)),
    moderators: getModerators(),
    marketTrades,
    marketGraph,
    isGasCostFetched: property => isGasCostFetched(state, property),
    isGasPriceFetched: isGasPriceFetched(state),
    gasCosts: getGasCosts(state),
    gasPrice: getGasPrice(state),
    currentBalance: getCurrentBalance(state),
    collateralTokenBalance: getTokenAmount(state, market.collateralToken),
    collateralTokenSymbol: getTokenSymbol(state, market.collateralToken),
    mainnetAddress: getRegisteredMainnetAddress(state),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarket: () => dispatch(requestMarket(marketId)),
  fetchMarketShares: accountAddress => dispatch(requestMarketSharesForAccount(marketId, accountAddress)),
  fetchMarketTradesForAccount: accountAddress => dispatch(requestMarketTradesForAccount(marketId, accountAddress)),
  fetchMarketTrades: () => dispatch(requestMarketGraphTrades(marketId)),
  buyShares: (market, outcomeIndex, outcomeTokenCount, cost) => dispatch(buyMarketShares(market, outcomeIndex, outcomeTokenCount, cost)),
  sellShares: (market, outcomeIndex, outcomeTokenCount, earnings) => dispatch(sellMarketShares(market, outcomeIndex, outcomeTokenCount, earnings)),
  changeUrl: url => dispatch(replace(url)),
  redeemWinnings: market => redeemMarket(market),
  requestGasCost: (contractType, opts) => dispatch(requestGasCost(contractType, opts)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestTokenSymbol: tokenAddress => dispatch(requestTokenSymbol(tokenAddress)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarketDetail)
