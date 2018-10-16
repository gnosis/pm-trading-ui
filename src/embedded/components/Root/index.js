import React from 'react'
import { hot } from 'react-hot-loader'
import EmbeddedRouter from '../../routes'

console.log('loading root compo')
const RootComponent = () => (
  <EmbeddedRouter />
)

export default hot(module)(RootComponent)
