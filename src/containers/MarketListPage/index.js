import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import MarketList from 'components/MarketList'

import { getMarkets } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'

import { requestMarkets } from 'actions/market'

const filterMarkets = state => market => true // todo: implement

const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const marketsTotal = markets.length
  return {
    markets: markets.filter(filterMarkets(state)),
    marketsTotal,
    defaultAccount: getDefaultAccount(state),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarkets: () => dispatch(requestMarkets()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
