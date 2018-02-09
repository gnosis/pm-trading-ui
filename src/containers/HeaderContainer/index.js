import { connect } from 'react-redux'
import { openModal } from 'actions/modal'
import { withRouter } from 'react-router-dom'

import Header from 'components/Header'

import {
  getCurrentBalance,
  getCurrentNetwork,
  getCurrentAccount,
  getActiveProvider,
  checkWalletConnection,
  isConnectedToCorrectNetwork,
} from 'integrations/store/selectors'

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getActiveProvider(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

const mapDispatchToProps = dispatch => ({
  openConnectWalletModal: () => dispatch(openModal({ modalName: 'ModalConnectWallet' })),
  openNetworkCheckModal: () => dispatch(openModal({ modalName: 'ModalNetworkCheck' })),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
