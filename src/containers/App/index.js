/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'

import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderContainer from 'containers/HeaderContainer'

import './app.less'

class App extends Component {
  componentDidMount() {
    // this.props.connectBlockchain()
  }

  render() {
    if (!this.props.blockchainConnection) {
      return (
        <div className="appContainer">
          <div className="container">
            <h1 className="text-center">... Connecting</h1>
          </div>
        </div>
      )
    }

    const currentKey = this.props.location.pathname.split('/')[1] || '/'
    const timeout = { enter: 200, exit: 200 }

    return (
      <div className="appContainer">
        <HeaderContainer version={process.env.VERSION} />
        {this.props.hasWallet && <TransactionFloaterContainer />}
        <TransitionGroup>
          <CSSTransition key={currentKey} classNames="page-transition" timeout={timeout}>
            {this.props.children}
          </CSSTransition>
        </TransitionGroup>
      </div>
    )
  }
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  connectBlockchain: PropTypes.func,
  location: PropTypes.object,
  hasWallet: PropTypes.bool,
}

const mapStateToProps = state => ({
  blockchainConnection: state.blockchain.connectionTried,
  hasWallet: state.blockchain.defaultAccount != null,
})

export default connect(mapStateToProps, {
  connectBlockchain,
})(App)
