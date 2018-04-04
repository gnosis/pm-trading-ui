import { connect } from 'react-redux'
import MarketList from '../../components'
import actions from './actions'
import selector from './selector'

export default connect(selector, actions)(MarketList)
