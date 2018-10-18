import React from 'react'
import { hot } from 'react-hot-loader'
import EmbeddedRouter from '../../routes'

const RootComponent = () => (
  <EmbeddedRouter />
)

export default hot(module)(RootComponent)
