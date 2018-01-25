import React from 'react'
import PropTypes from 'prop-types'
import { Router, Route, IndexRedirect } from 'react-router'

import App from 'containers/App'
import MarketListPage from 'containers/MarketListPage'
import MarketCreateWizardPage from 'containers/MarketCreateWizardPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'
import MarketCreateReviewPage from 'containers/MarketCreateReviewPage'

const AppRouter = ({ history }) => (
  <Router key={Math.random()} history={history}>
    <Route path="/" component={App}>
      <IndexRedirect to="markets" />
      <Route path="dashboard" component={DashboardPage} />
      <Route path="transactions" component={TransactionsPage} />
      <Route path="markets">
        <IndexRedirect to="list" />
        <Route path="new" component={MarketCreateWizardPage} />
        <Route path="review" component={MarketCreateReviewPage} />
        <Route path="list" component={MarketListPage} />
        <Route path=":id" component={MarketDetailPage}>
          <Route path=":view">
            <Route path=":shareId" />
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>
)

AppRouter.propTypes = {
  history: PropTypes.shape.isRequired,
}

export default AppRouter
