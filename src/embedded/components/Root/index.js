import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { hot } from 'react-hot-loader'
import i18n from 'i18n'

import EmbeddedRouter from '../../routes'

const RootComponent = () => (
  <I18nextProvider i18n={i18n}>
    <EmbeddedRouter />
  </I18nextProvider>
)

export default hot(module)(RootComponent)
