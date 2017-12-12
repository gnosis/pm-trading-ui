import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import {
  getAccountTrades,
  getAccountPredictiveAssets,
  getMarkets,
} from 'selectors/market'
import {
  getAccountShares,
} from 'selectors/marketShares'
import { getCurrentAccount, getEtherTokensAmount, isGnosisInitialized, checkWalletConnection } from 'selectors/blockchain'
import { requestMarkets, requestAccountTrades, requestAccountShares, redeemWinnings } from 'actions/market'
import { requestGasPrice, requestEtherTokens } from 'actions/blockchain'
import { weiToEth } from 'utils/helpers'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getCurrentAccount(state)
  const accountTrades = getAccountTrades(state, defaultAccount)
  const accountPredictiveAssets = weiToEth(getAccountPredictiveAssets(state, defaultAccount))
  const accountShares = getAccountShares(state)

  const gnosisInitialized = isGnosisInitialized(state)
  let etherTokens = getEtherTokensAmount(state, defaultAccount)

  if (etherTokens !== undefined) {
    etherTokens = weiToEth(etherTokens.toString())
  } else {
    etherTokens = '0'
  }

  return {
    hasWallet: checkWalletConnection(state),
    defaultAccount,
    markets,
    etherTokens,
    accountShares,
    accountTrades,
    accountPredictiveAssets,
    gnosisInitialized,
  }
}

const mapDispatchToProps = dispatch => ({
  redeemWinnings: market => dispatch(redeemWinnings(market)),
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestEtherTokens: account => dispatch(requestEtherTokens(account)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
