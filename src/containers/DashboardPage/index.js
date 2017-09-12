import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import DashboardPage from 'components/Dashboard'
import { getMarkets, getAccountShares, getAccountTrades,
  getAccountPredictiveAssets } from 'selectors/market'
import { getDefaultAccount, getEtherTokensAmount } from 'selectors/blockchain'
import { requestMarkets, requestAccountTrades, requestAccountShares } from 'actions/market'
import { requestGasPrice, requestEtherTokens } from 'actions/blockchain'
import { weiToEth, add0xPrefix } from 'utils/helpers'

import sha1 from 'sha1'


const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const defaultAccount = getDefaultAccount(state)
  const accountTrades = getAccountTrades(state, defaultAccount)
  const accountPredictiveAssets = weiToEth(getAccountPredictiveAssets(state, defaultAccount))
  let accountShares = getAccountShares(state, defaultAccount)
  // Not displayed anymore
  // const accountParticipatingInEvents = getAccountParticipatingInEvents(state, defaultAccount).length
  let etherTokens = getEtherTokensAmount(state, defaultAccount)

  if (etherTokens !== undefined) {
    etherTokens = weiToEth(etherTokens.toString())
  } else {
    etherTokens = 0
  }

  // In the absence of the market address inside the share object,
  // we need to get it by looking for the event address
  // TODO add 0x to addresses in Gnosisdb outcomeToken object
  if (markets.length) {
    accountShares = accountShares.map((s) => {
      const market = markets.filter(m => m.event.address === add0xPrefix(s.outcomeToken.event))[0]
      const share = { ...s }
      share.id = sha1(`${market.address}-${defaultAccount}-${s.outcomeToken.address}`)
      return share
    })
  }

  return {
    defaultAccount,
    markets,
    etherTokens,
    accountShares,
    accountTrades,
    accountPredictiveAssets,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarkets()),
  requestAccountTrades: address => dispatch(requestAccountTrades(address)),
  requestAccountShares: address => dispatch(requestAccountShares(address)),
  changeUrl: url => dispatch(push(url)),
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestEtherTokens: account => dispatch(requestEtherTokens(account)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
