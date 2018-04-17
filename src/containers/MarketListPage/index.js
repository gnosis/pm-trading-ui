import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { formValueSelector } from 'redux-form'

import MarketList from 'components/MarketList'

import { filterMarkets, sortMarkets } from 'selectors/market'
import { getCurrentAccount } from 'integrations/store/selectors'

import { requestMarkets } from 'actions/market'
import { getConfiguration } from 'utils/features'

const config = getConfiguration()

const mapStateToProps = (state) => {
  // const markets = getMarkets(state)
  const defaultAccount = getCurrentAccount(state)
  const filterForm = formValueSelector('marketListFilter')
  const filterSearch = filterForm(state, 'search')
  const filterShowResolved = filterForm(state, 'resolved')
  const filterOrderBy = filterForm(state, 'orderBy')
  const filterMyMarkets = filterForm(state, 'myMarkets')
  const filteredMarktes = filterMarkets(state)({
    textSearch: filterSearch,
    resolved: filterShowResolved,
    onlyMyMarkets: filterMyMarkets,
    onlyModeratorsMarkets: Object.keys(config.whitelist).length > 0, // Show only markets created by moderators if they're declared in config
    defaultAccount,
  })

  const isModerator = config.whitelist[defaultAccount] !== undefined

  return {
    markets: sortMarkets(filteredMarktes, filterOrderBy && filterOrderBy.value),
    defaultAccount,
    isModerator,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMarkets: () => dispatch(requestMarkets()),
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketList)
