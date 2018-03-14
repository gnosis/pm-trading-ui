/* global __VERSION__ */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { providerPropType } from 'utils/shapes'

import HeaderContainer from 'containers/HeaderContainer'
import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import { triedToConnect } from 'selectors/blockchain'
import { getActiveProvider, isConnectedToCorrectNetwork } from 'integrations/store/selectors'

import './app.scss'

class App extends Component {
  state = {
    transition: false,
  }

  componentWillReceiveProps(nextProps) {
    const prevTransitionKey = this.props.location.pathname.split('/')[1]
    const newTransitionKey = nextProps.location.pathname.split('/')[1]

    if (newTransitionKey !== prevTransitionKey) {
      this.setState({ transition: true })
    } else {
      this.setState({ transition: false })
    }
  }

  render() {
    if (!this.props.blockchainConnection) {
      return (
        <div className="appContainer">
          <div className="loader-container">
            <IndefiniteSpinner width={100} height={100} />
            <h1>Connecting</h1>
          </div>
        </div>
      )
    }

    const timeout = { enter: 200, exit: 200 }

    let childrenContainer = <div>{this.props.children}</div>
    if (this.state.transition) {
      childrenContainer = (
        <TransitionGroup>
          <CSSTransition
            key={this.props.location.pathname.split('/')[1]}
            classNames="page-transition"
            timeout={timeout}
          >
            {this.props.children}
          </CSSTransition>
        </TransitionGroup>
      )
    }

    return (
      <div className="appContainer">
        <HeaderContainer version={process.env.VERSION} />
        {this.props.provider && this.props.provider.account && <TransactionFloaterContainer />}
        {childrenContainer}
      </div>
    )
  }
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  location: PropTypes.object,
  provider: providerPropType,
}

App.defaultProps = {
  blockchainConnection: false,
  children: <div />,
  location: {},
  provider: {},
}

const mapStateToProps = state => ({
  provider: getActiveProvider(state),
  blockchainConnection: triedToConnect(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

export default withRouter(connect(mapStateToProps, {
  connectBlockchain,
})(App))
