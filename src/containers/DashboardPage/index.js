import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import DashboardPage from 'components/Dashboard'
import { getMarkets } from 'selectors/market'
import { profitsSelector } from 'containers/DashboardPage/store/selectors'
import { getAccountTrades } from 'selectors/marketTrades'
import { getAccountShares } from 'selectors/marketShares'
import { isGnosisInitialized, getTokenAmount, getTokenSymbol } from 'selectors/blockchain'
import { getCurrentAccount, checkWalletConnection } from 'integrations/store/selectors'
import { requestMarkets, requestAccountTrades, requestAccountShares, redeemWinnings } from 'actions/market'
import { requestGasPrice, requestTokenBalance, requestTokenSymbol } from 'actions/blockchain'
import { weiToEth } from 'utils/helpers'
import { fetchTournamentUserData, fetchTournamentUsers } from 'routes/Scoreboard/store/actions'

const collateralToken = 'collateralToken'

const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getCurrentAccount(state)
  const accountTrades = getAccountTrades(defaultAccount)(state)
  const accountPredictiveAssets = weiToEth(profitsSelector(state, defaultAccount))
  const accountShares = getAccountShares(state)
  const gnosisInitialized = isGnosisInitialized(state)
  let defaultTokenAmount = getTokenAmount(state, collateralToken.address)
  const hasWallet = checkWalletConnection(state)
  const tokenSymbol = getTokenSymbol(state, collateralToken.address)

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
    tokenSymbol,
    tokenAddress: collateralToken.address,
    tokenIcon: collateralToken.icon,
  }
}

const mapDispatchToProps = dispatch => ({
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestDefaultTokenAmount: account => dispatch(requestTokenBalance(collateralToken.address, account)),
  requestTokenSymbol: () => dispatch(requestTokenSymbol(collateralToken.address)),
  fetchTournamentUsers: () => dispatch(fetchTournamentUsers()),
  fetchTournamentUserData: account => dispatch(fetchTournamentUserData(account)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
