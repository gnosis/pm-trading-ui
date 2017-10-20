/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'
import { providerPropType } from 'utils/shapes'

import LoadingIndicator from 'components/LoadingIndicator'

import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderContainer from 'containers/HeaderContainer'

import { getSelectedProvider, isConnectedToCorrectNetwork } from 'selectors/blockchain'

import './app.less'
import modalStyles from './modalStyles'

class App extends Component {
  componentWillReceiveProps(props) {
    if (
      (this.props.isConnectedToCorrectNetwork !== props.isConnectedToCorrectNetwork) &&
      (!props.isConnectedToCorrectNetwork)
    ) {
      console.log("network changed to wrong network")
    }
  }

  render() {
    if (!this.props.blockchainConnection) {
      return (
        <div className="appContainer">
          <div className="loader-container">
            <LoadingIndicator width={100} height={100} />
            <h1>Connecting</h1>
          </div>
        </div>
      )
    }

    const currentKey = this.props.location.pathname.split('/')[2] || this.props.location.pathname.split('/')[1] || '/'
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
        <Modal
          isOpen={this.props.blockchainConnection && (!this.props.provider || !this.props.provider.account)}
          contentLabel="no-account-modal"
          style={modalStyles}
        >
          <h1 id="heading">Oops!</h1>
          <div id="description">
            <p>We couldn&apos;t detect your account. Please check your wallet provider and reload the page</p>
          </div>
        </Modal>
      </div>
    )
  }
}

App.propTypes = {
  provider: providerPropType,
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
