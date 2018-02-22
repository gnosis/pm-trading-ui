import React from 'react'
import { hot } from 'react-hot-loader'
import { ConnectedRouter } from 'react-router-redux'
import BackdropProvider from 'containers/BackdropProvider'
import AppContainer from 'containers/App'
import store, { history } from 'store'
import { Provider } from 'react-redux'
import AppRouter from 'routes'

const RootComponent = () => (
  <Provider store={store}>
    <BackdropProvider>
      <ConnectedRouter history={history}>
        <AppContainer>
          <AppRouter />
        </AppContainer>
      </ConnectedRouter>
    </BackdropProvider>
  </Provider>
)

export default hot(module)(RootComponent)
