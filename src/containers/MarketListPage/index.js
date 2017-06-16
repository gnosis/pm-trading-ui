import { connect } from 'react-redux'

import MarketList from 'components/MarketList'

const mapStateToProps = (state, ownProps) => ({
  markets: []
})

export default connect(mapStateToProps)(MarketList)
