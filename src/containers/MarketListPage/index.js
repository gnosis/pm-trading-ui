import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { formValueSelector } from 'redux-form'

import MarketList from 'components/MarketList'
import { getMarkets, filterMarkets } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'
import { requestMarketList } from 'actions/market'
import { connectBlockchain } from 'actions/blockchain'

const mapStateToProps = (state) => {
  //const markets = getMarkets(state)

  const filterForm = formValueSelector('marketListFilter')
  const filterSearch = filterForm(state, 'search')
  const filterShowResolved = filterForm(state, 'resolved')

  return {
    markets: filterMarkets(state)({ textSearch: filterSearch, resolved: filterShowResolved }),
    defaultAccount: getDefaultAccount(state),
  }
}

const mapDispatchToProps = dispatch => ({
  requestMarkets: () => dispatch(requestMarketList()),
  connectBlockchain: () => dispatch(connectBlockchain()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
