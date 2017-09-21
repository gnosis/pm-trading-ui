import React from 'react'
import { connect } from 'react-redux'

import Header from 'components/Header'
import { getDefaultAccount, getCurrentBalance, getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'

const getProviderIcon = (name) => {
  let icon

  if (name === WALLET_PROVIDER.METAMASK) {
    icon = <div className="headerIcon headerIcon--metamask" />
  } else if (name === WALLET_PROVIDER.PARITY) {
    icon = <div className="headerIcon headerIcon--parity" />
  } else {
    icon = <div className="headerIcon headerIcon--default" />
  }

  return icon
}

const mapStateToProps = (state) => {
  const currentProvider = getSelectedProvider(state)
  return {
    defaultAccount: getDefaultAccount(state),
    currentBalance: getCurrentBalance(state),
    currentProvider: currentProvider ? currentProvider.name : currentProvider,
    getProviderIcon,
  }
}

export default connect(mapStateToProps)(Header)
