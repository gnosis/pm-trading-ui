import { connect } from 'react-redux'
import Dashboard from '../../components/Dashboard'
import actions from './actions'
import selector from './selectors'

export default connect(
  selector,
  actions,
)(Dashboard)
