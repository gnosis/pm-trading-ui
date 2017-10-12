import { connect } from 'react-redux'

import Header from 'components/Header'
import { getCurrentAccount, getCurrentBalance, getCurrentNetwork, getSelectedProvider } from 'selectors/blockchain'

const mapStateToProps = (state) => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getSelectedProvider(state),
})

export default connect(mapStateToProps)(Header)
