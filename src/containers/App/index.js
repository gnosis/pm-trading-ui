/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'

import LoadingIndicator from 'components/LoadingIndicator'

import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderContainer from 'containers/HeaderContainer'

import { getSelectedProvider, isConnectedToCorrectNetwork } from 'selectors/blockchain'

import './app.less'

const App = (props) => {
  if (!props.blockchainConnection) {
    return (
      <div className="appContainer">
        <div className="loader-container">
          <LoadingIndicator width={100} height={100} />
          <h1>Connecting</h1>
        </div>
      </div>
    )
  }

  const currentKey = props.location.pathname.split('/')[2] || props.location.pathname.split('/')[1] || '/'
  const timeout = { enter: 200, exit: 200 }

  return (
    <div className="appContainer">
      <HeaderContainer version={process.env.VERSION} />
      {props.hasWallet && <TransactionFloaterContainer />}
      <TransitionGroup>
        <CSSTransition key={currentKey} classNames="page-transition" timeout={timeout}>
          {props.children}
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  location: PropTypes.object,
  hasWallet: PropTypes.bool,
}

const mapStateToProps = state => ({
  provider: getSelectedProvider(state),
  blockchainConnection: state.blockchain.connectionTried,
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

export default connect(mapStateToProps, {
  connectBlockchain,
})(App)
