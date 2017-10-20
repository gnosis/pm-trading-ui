import React from 'react'
import { connect } from 'react-redux'
import { openModal } from 'actions/modal'

import Header from 'components/Header'
import { checkWalletConnection, getCurrentBalance, getCurrentNetwork, getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'

export const getProviderIcon = (name) => {
  let icon

  if (name === WALLET_PROVIDER.METAMASK) {
    icon = <div className="headerIcon headerIcon--metamask pull-left" />
  } else if (name === WALLET_PROVIDER.PARITY) {
    icon = <div className="headerIcon headerIcon--parity pull-left" />
  } else {
    icon = <div className="headerIcon headerIcon--default pull-left" />
  }

  return icon
}

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getSelectedProvider(state),
  getProviderIcon,
})

const mapDispatchToProps = dispatch => ({
  openConnectWalletModal: () => dispatch(openModal({ modalName: 'ModalConnectWallet' })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
