import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import actions from './actions'
import selector from './selector'

const LoadableMarketList = Loadable({
  loader: () => import('../../components/MarketList'),
  loading: () => null,
})

export default connect(
  selector,
  actions,
)(LoadableMarketList)
