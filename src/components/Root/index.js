import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import BackdropProvider from 'containers/BackdropProvider'
import AppContainer from 'containers/App'
import store from 'store'
import { Provider } from 'react-redux'
import AppRouter from 'routes'

const RootComponent = () => (
  <BrowserRouter>
    <Provider store={store}>
      <BackdropProvider>
        <AppContainer>
          <AppRouter />
        </AppContainer>
      </BackdropProvider>
    </Provider>
  </BrowserRouter>
)

export default hot(module)(RootComponent)
