import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

import 'scss/style.scss'
import 'normalize.css'

import RootComponent from './components/Root'

render(<RootComponent />, document.getElementById('root'))
