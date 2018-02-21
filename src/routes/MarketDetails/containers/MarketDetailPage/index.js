import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { replace } from 'react-router-redux'
import { requestGasCost, requestGasPrice } from 'actions/blockchain'
import MarketDetail from 'routes/MarketDetails/components/MarketDetail'

import {
  buyMarketShares,
  sellMarketShares,
  requestMarketShares,
  requestMarket,
  requestMarketTrades,
  requestMarketTradesForAccount,
  redeemWinnings,
  withdrawFees,
} from 'actions/market'
import { getMarketById } from 'selectors/market'
import { getMarketTradesForAccount } from 'selectors/marketTrades'
import { getMarketShares } from 'selectors/marketShares'
import { getMarketGraph } from 'selectors/marketGraph'
import { getGasCosts, getGasPrice, isGasCostFetched, isGasPriceFetched } from 'selectors/blockchain'
import { checkWalletConnection, getCurrentAccount, getCurrentBalance, isOnWhitelist } from 'integrations/store/selectors'
import { isModerator, getModerators } from 'utils/helpers'

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
    isOnWhitelist: isOnWhitelist(state),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarket: () => dispatch(requestMarket(marketId)),
  fetchMarketShares: accountAddress => dispatch(requestMarketShares(marketId, accountAddress)),
  fetchMarketTradesForAccount: accountAddress => dispatch(requestMarketTradesForAccount(marketId, accountAddress)),
  fetchMarketTrades: market => dispatch(requestMarketTrades(market)),
  buyShares: (market, outcomeIndex, outcomeTokenCount, cost) =>
    dispatch(buyMarketShares(market, outcomeIndex, outcomeTokenCount, cost)),
  sellShares: (market, outcomeIndex, outcomeTokenCount, earnings) =>
    dispatch(sellMarketShares(market, outcomeIndex, outcomeTokenCount, earnings)),
  changeUrl: url => dispatch(replace(url)),
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  withdrawFees: market => dispatch(withdrawFees(market)),
  requestGasCost: (contractType, opts) => dispatch(requestGasCost(contractType, opts)),
  requestGasPrice: () => dispatch(requestGasPrice()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketDetail)
