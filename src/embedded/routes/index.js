import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import EmbeddedView from './EmbeddedView'

const NoMatch = () => (<span>404</span>)

const EmbeddedRouter = () => (
  <HashRouter basename="/embedded">
    <Switch>
      {/* Add more Routes here, before the /:address route */}
      <Route exact path="/:address" component={EmbeddedView} />
      <Route component={NoMatch} />
    </Switch>
  </HashRouter>
)

export default EmbeddedRouter
