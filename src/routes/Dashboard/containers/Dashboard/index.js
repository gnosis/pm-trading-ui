import { connect } from 'react-redux'

import actions from './actions'
import selector from './selectors'

import Dashboard from '../../components/Dashboard'

export default connect(selector, actions)(Dashboard)
