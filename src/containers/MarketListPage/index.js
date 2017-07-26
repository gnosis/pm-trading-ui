import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import MarketList from 'components/MarketList'
import { getMarkets } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'
import { requestMarketList } from 'actions/market'
import { connectBlockchain } from 'actions/blockchain'

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
  requestMarkets: () => dispatch(requestMarketList()),
  connectBlockchain: () => dispatch(connectBlockchain()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
