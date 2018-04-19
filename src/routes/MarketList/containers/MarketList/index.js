import { connect } from 'react-redux'
import MarketList from '../../components/MarketList'
import actions from './actions'
import selector from './selector'

export default connect(selector, actions)(MarketList)
