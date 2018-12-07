import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withNamespaces } from 'react-i18next'

import Header from 'components/Header'

import actions from './store/actions'
import selectors from './store/selectors'

const enhancer = compose(
  withRouter,
  connect(selectors, actions),
  withNamespaces(),
)

export default enhancer(Header)
