import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import BackdropProvider from 'containers/BackdropProvider'
import AppContainer from 'containers/App'
import store from 'store'
import { Provider } from 'react-redux'
import AppRouter from 'routes'
import i18n from 'i18n'

const RootComponent = () => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Provider store={store}>
        <BackdropProvider>
          <AppContainer>
            <AppRouter />
          </AppContainer>
        </BackdropProvider>
      </Provider>
    </BrowserRouter>
  </I18nextProvider>
)

export default hot(module)(RootComponent)
