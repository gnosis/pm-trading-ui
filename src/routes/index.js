import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MarketListPage from 'containers/MarketListPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'

const AppRouter = () => (
  <Switch>
    <Redirect exact from="/" to="/markets/list" />
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/transactions" component={TransactionsPage} />
    <Route exact path="/markets/list" component={MarketListPage} />
    <Route exact path="/markets/:id/:view?/:shareId?" component={MarketDetailPage} />
  </Switch>
)

export default AppRouter
