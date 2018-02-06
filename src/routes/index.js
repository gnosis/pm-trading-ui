import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MarketListPage from 'containers/MarketListPage'
// import MarketCreateWizardPage from 'containers/MarketCreateWizardPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'
// import MarketCreateReviewPage from 'containers/MarketCreateReviewPage'

const AppRouter = () => (
  <Switch>
    <Redirect exact from="/" to="/markets/list" />
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/transactions" component={TransactionsPage} />
    <Route exact path="/markets/list" component={MarketListPage} />
    <Route exact path="/markets/:id/:view?/:shareId?" component={MarketDetailPage} />
  </Switch>
)

{
  /* <Route path="markets">
      <IndexRedirect to="list" />
      <Route path="new" component={MarketCreateWizardPage} />
      <Route path="review" component={MarketCreateReviewPage} />
      <Route path="list" component={MarketListPage} />
      <Route path=":id" component={MarketDetailPage}>
        <Route path=":view">
          <Route path=":shareId" />
        </Route>
      </Route>
    </Route> */
}

export default AppRouter
