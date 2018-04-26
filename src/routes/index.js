import PropTypes from 'prop-types'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import web3 from 'web3'

import GameGuidePage from 'routes/GameGuide/containers/GameGuide'
import MarketListPage from 'routes/MarketList/containers/MarketList'
import ScoreboardPage from 'routes/Scoreboard/containers/ScoreBoard'
import MarketDetailPage from 'routes/MarketDetails/containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'routes/Dashboard/containers/Dashboard'
import { isFeatureEnabled, getFeatureConfig } from 'utils/features'

const gameGuideConfig = getFeatureConfig('gameGuide')

const marketDetailRender = (props) => {
  if (web3.utils.isAddress(props.match.params.id)) {
    return <MarketDetailPage {...props} />
  }
  return <Redirect to="/markets/list" />
}
const showGameGuide = gameGuideConfig.type === 'default'

marketDetailRender.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
}

const AppRouter = () => (
  <Switch>
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/transactions" component={TransactionsPage} />
    <Route exact path="/markets/list" component={MarketListPage} />
    <Route exact path="/markets/:id/:view?/:shareId?" render={marketDetailRender} />
    {isFeatureEnabled('scoreboard') && <Route exact path="/scoreboard" component={ScoreboardPage} />}
    {showGameGuide && <Route exact path="/game-guide" component={GameGuidePage} />}
    <Redirect to="/markets/list" />
  </Switch>
)

export default AppRouter
