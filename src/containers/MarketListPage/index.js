import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { formValueSelector } from 'redux-form'

import MarketList from 'components/MarketList'
import { getMarkets } from 'selectors/market'
import { requestMarketList } from 'actions/market'

const filterMarkets = state => market => true // todo: implement

const mapStateToProps = (state) => {
  const markets = getMarkets(state)
  const marketsTotal = markets.length
  return {
    markets: markets.filter(filterMarkets(state)),
    marketsTotal,
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarketList()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
