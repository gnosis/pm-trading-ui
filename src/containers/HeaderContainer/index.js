import { connect } from 'react-redux'

import { activeWallet } from 'selectors/wallet'
import Header from 'components/Header'

export default connect(state => ({
  wallet: activeWallet(state),
}))(Header)
