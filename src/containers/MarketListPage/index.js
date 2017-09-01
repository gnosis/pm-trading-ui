import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { formValueSelector } from 'redux-form'

import MarketList from 'components/MarketList'

import { filterMarkets, sortMarkets } from 'selectors/market'
import { getDefaultAccount } from 'selectors/blockchain'

import { requestMarkets } from 'actions/market'

const mapStateToProps = (state) => {
  // const markets = getMarkets(state)
  const defaultAccount = getDefaultAccount(state)
  const filterForm = formValueSelector('marketListFilter')
  const filterSearch = filterForm(state, 'search')
  const filterShowResolved = filterForm(state, 'resolved')
  const filterOrderBy = filterForm(state, 'orderBy')
  const filterMyMarkets = filterForm(state, 'myMarkets')
  const filteredMarktes = filterMarkets(state)({
    textSearch: filterSearch,
    resolved: filterShowResolved,
    onlyMyMarkets: filterMyMarkets,
    defaultAccount,
  })

  return {
    markets: sortMarkets(filteredMarktes, filterOrderBy),
    defaultAccount,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarkets: () => dispatch(requestMarkets()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
