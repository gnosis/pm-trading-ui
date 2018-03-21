import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import DashboardPage from 'components/Dashboard'
import { getMarkets } from 'selectors/market'
import { profitsSelector } from 'containers/DashboardPage/store/selectors'
import { getAccountTrades } from 'selectors/marketTrades'
import { getAccountShares } from 'selectors/marketShares'
import { isGnosisInitialized, getDefaultTokenAmount, getTokenSymbol } from 'selectors/blockchain'
import { getCurrentAccount, checkWalletConnection } from 'integrations/store/selectors'
import { requestMarkets, requestAccountTrades, requestAccountShares, redeemWinnings } from 'actions/market'
import { requestGasPrice, requestTokenBalance, requestTokenSymbol } from 'actions/blockchain'
import { weiToEth } from 'utils/helpers'
import { getTokenAddress } from 'utils/configuration'

const tokenAddress = getTokenAddress()

const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getCurrentAccount(state)
  const accountTrades = getAccountTrades(defaultAccount)(state)
  const accountPredictiveAssets = weiToEth(profitsSelector(state, defaultAccount))
  const accountShares = getAccountShares(state)
  const gnosisInitialized = isGnosisInitialized(state)
  let defaultTokenAmount = getDefaultTokenAmount(state, defaultAccount)
  const hasWallet = checkWalletConnection(state)
  const tokenSymbol = getTokenSymbol(state, tokenAddress)

  if (defaultTokenAmount !== undefined) {
    defaultTokenAmount = weiToEth(defaultTokenAmount.toString())
  } else {
    defaultTokenAmount = '0'
  }

  return {
    hasWallet,
    defaultAccount,
    markets,
    defaultTokenAmount,
    accountShares,
    accountTrades,
    gnosisInitialized,
    accountPredictiveAssets,
    tokenAddress,
    tokenSymbol,
  }
}

const mapDispatchToProps = dispatch => ({
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestEtherTokens: account => dispatch(requestTokenBalance(account)),
  requestTokenSymbol: () => dispatch(requestTokenSymbol(tokenAddress)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
