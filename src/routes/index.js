import PropTypes from 'prop-types'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import web3 from 'web3'

import MarketListPage from 'containers/MarketListPage'
// import MarketListMoe from 'routes/marketlist/container/MarketList'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'

const marketDetailRender = (props) => {
  if (web3.utils.isAddress(props.match.params.id)) {
    return <MarketDetailPage {...props} />
  }
  return <Redirect to="/markets/list" />
}

marketDetailRender.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
}

const AppRouter = () => (
  <Switch>
    <Redirect exact from="/" to="/markets/list" />
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/transactions" component={TransactionsPage} />
    <Route exact path="/markets/list" component={MarketListPage} />
    {/* <Route exact path="/markets/moe" component={MarketListMoe} /> */}
    <Route exact path="/markets/:id/:view?/:shareId?" render={marketDetailRender} />
  </Switch>
)

export default AppRouter
