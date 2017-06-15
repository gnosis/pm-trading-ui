import { connect } from 'react-redux'

import { activeWallet, walletsLoaded } from 'selectors/wallet'
import Header from 'components/Header'

export default connect(state => ({
  wallet: activeWallet(state),
  walletLoaded: walletsLoaded(state),
}))(Header)
