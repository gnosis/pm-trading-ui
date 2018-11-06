import { connect } from 'react-redux'
import actions from './actions'
import selector from './selector'
import MarketList from '../../components/MarketList'

export default connect(
  selector,
  actions,
)(MarketList)
