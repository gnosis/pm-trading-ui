/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'

import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderContainer from 'containers/HeaderContainer'

import './app.less'
import modalStyles from './modalStyles'
import LoadingIcon from '../../components/Icons/loading'

class App extends Component {
  componentDidMount() {
    // this.props.connectBlockchain()
  }

  render() {
    if (!this.props.blockchainConnection) {
      return (
        <div className="appContainer">
          <div className="loader-container">
            <LoadingIcon />
            <h1>Connecting</h1>
          </div>
        </div>
      )
    }

    return (
      <div className="appContainer">
        <HeaderContainer version={process.env.VERSION} />
        {this.props.hasWallet && <TransactionFloaterContainer />}
        <TransitionGroup>
          <CSSTransition key={currentKey} classNames="page-transition" timeout={timeout}>
            {this.props.children}
          </CSSTransition>
        </TransitionGroup>
        <Modal
          isOpen={this.props.blockchainConnection && !this.props.account}
          contentLabel="no-account-modal"
          style={modalStyles}
        >
          <h1 id="heading">Oops!</h1>
          <div id="description">
            <p>We couldn't detect your account. Please check your wallet provider and reload the page</p>
          </div>
        </Modal>
      </div>
    )
  }
}

App.propTypes = {
  account: PropTypes.string,
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  connectBlockchain: PropTypes.func,
  blockchainConnection: PropTypes.bool,
  hasWallet: PropTypes.bool,
}

const mapStateToProps = state => ({
  account: state.blockchain.defaultAccount,
  blockchainConnection: state.blockchain.connectionTried,
  hasWallet: state.blockchain.defaultAccount != null,
})

export default connect(mapStateToProps, {
  connectBlockchain,
})(App)
