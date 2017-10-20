import React from 'react'
import { connect } from 'react-redux'
import { openModal } from 'actions/modal'

import Header from 'components/Header'
import { checkWalletConnection, getCurrentBalance, getCurrentNetwork, getSelectedProvider } from 'selectors/blockchain'

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getSelectedProvider(state),
})

const mapDispatchToProps = dispatch => ({
  openConnectWalletModal: () => dispatch(openModal({ modalName: 'ModalConnectWallet' })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
