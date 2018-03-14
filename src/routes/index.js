import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import web3 from 'web3'

import GameGuidePage from 'routes/GameGuide/containers/GameGuide'
import MarketListPage from 'containers/MarketListPage'
import ScoreboardPage from 'routes/Scoreboard/containers/ScoreBoard'
import MarketDetailPage from 'routes/MarketDetails/containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'

const marketDetailRender = (props) => {
  if (web3.utils.isAddress(props.match.params.id)) {
    return <MarketDetailPage {...props} />
  }
  return <Redirect to="/markets/list" />
}

const AppRouter = () => (
  <Switch>
    <Redirect exact from="/" to="/markets/list" />
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/transactions" component={TransactionsPage} />
    <Route exact path="/markets/list" component={MarketListPage} />
    <Route exact path="/markets/:id/:view?/:shareId?" render={marketDetailRender} />
    <Route exact path="/game-guide" component={GameGuidePage} />
    <Route exact path="/scoreboard" component={ScoreboardPage} />
  </Switch>
)

export default AppRouter
