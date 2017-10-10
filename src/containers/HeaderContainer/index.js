import { connect } from 'react-redux'

import Header from 'components/Header'
import { getCurrentAccount, getCurrentBalance, getSelectedProvider } from 'selectors/blockchain'

const mapStateToProps = (state) => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  currentProvider: getSelectedProvider(state),
})

export default connect(mapStateToProps)(Header)
