import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Header from 'components/Header'

import actions from './store/actions'
import selectors from './store/selectors'

export default withRouter(connect(selectors, actions)(Header))
