import { connect } from 'react-redux'
import Loadable from 'react-loadable'

import actions from './actions'
import selector from './selectors'

const LoadableDashboard = Loadable({
  loader: () => import('../../components/Dashboard'),
  loading: () => null,
})

export default connect(
  selector,
  actions,
)(LoadableDashboard)
