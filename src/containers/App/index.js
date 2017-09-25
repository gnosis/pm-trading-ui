/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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

    return (
      <div className="appContainer">
        <HeaderContainer version={process.env.VERSION} />
        {this.props.hasWallet && <TransactionFloaterContainer />}
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
  connectBlockchain: PropTypes.func,
  blockchainConnection: PropTypes.bool,
  hasWallet: PropTypes.bool,
}

const mapStateToProps = state => ({
  blockchainConnection: state.blockchain.connectionTried,
  hasWallet: state.blockchain.defaultAccount != null,
})

export default connect(mapStateToProps, {
  connectBlockchain,
})(App)
