import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'
import { requestGasPrice, requestTokenSymbol } from 'actions/blockchain'
import MarketDetail from 'routes/MarketDetails/components/MarketDetail'

import { redeemWinnings } from 'actions/market'
import {
  buyMarketShares,
  sellMarketShares,
  requestMarketTrades,
  requestMarketSharesForAccount,
  requestMarketTradesForAccount,
  requestMarket,
  requestGasCost,
} from 'routes/MarketDetails/store/actions'
import { getMarketById } from 'selectors/market'
import {
  getMarketGraph,
  getMarketTradesForAccount,
  getMarketShares,
  getGasCosts,
  getGasPrice,
  isGasCostFetched,
  isGasPriceFetched,
} from 'routes/MarketDetails/store/selectors'
import { checkWalletConnection, getCurrentAccount, getCurrentBalance } from 'integrations/store/selectors'
import { isModerator, getModerators } from 'utils/helpers'
import { getTokenSymbol } from 'selectors/blockchain'

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
    isModerator: isModerator(getCurrentAccount(state)),
    moderators: getModerators(),
    marketTrades,
    marketGraph,
    isGasCostFetched: property => isGasCostFetched(state, property),
    isGasPriceFetched: isGasPriceFetched(state),
    gasCosts: getGasCosts(state),
    gasPrice: getGasPrice(state),
    currentBalance: getCurrentBalance(state),
    collateralTokenSymbol: getTokenSymbol(state, market.event?.collateralToken),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarket: () => dispatch(requestMarket(marketId)),
  fetchMarketShares: accountAddress => dispatch(requestMarketSharesForAccount(marketId, accountAddress)),
  fetchMarketTradesForAccount: accountAddress => dispatch(requestMarketTradesForAccount(marketId, accountAddress)),
  fetchMarketTrades: market => dispatch(requestMarketTrades(market)),
  buyShares: (market, outcomeIndex, outcomeTokenCount, cost) =>
    dispatch(buyMarketShares(market, outcomeIndex, outcomeTokenCount, cost)),
  sellShares: (market, outcomeIndex, outcomeTokenCount, earnings) =>
    dispatch(sellMarketShares(market, outcomeIndex, outcomeTokenCount, earnings)),
  changeUrl: url => dispatch(replace(url)),
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  requestGasCost: (contractType, opts) => dispatch(requestGasCost(contractType, opts)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestTokenSymbol: tokenAddress => dispatch(requestTokenSymbol(tokenAddress)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
