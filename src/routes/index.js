import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import App from 'containers/App'
import MarketListPage from 'containers/MarketListPage'
import MarketCreateWizardPage from 'containers/MarketCreateWizardPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import DashboardPage from 'containers/DashboardPage'
import MarketCreateReviewPage from 'containers/MarketCreateReviewPage'

const AppRouter = () => (
  <Route path="/" component={App}>
    <Switch>
      <Redirect from="/" to="/markets/list" />
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route exact path="/transactions" component={TransactionsPage} />
      <Route exact path="/markets/list" component={MarketListPage} />
    </Switch>
  </Route>
)

//  <Switch>
//   <Route path="/list" component={MarketListPage} />
//   <Route path="/new" component={MarketCreateWizardPage} />
//   <Route path="/review" component={MarketCreateReviewPage} />
//   /* <Route path=":id" component={MarketDetailPage}>
//       <Route path=":view">
//         <Route path=":shareId" />
//       </Route>
//     </Route> */
//    </Switch>

export default AppRouter
