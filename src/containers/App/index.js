/* global __VERSION__ */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Footer from 'components/Footer'
import Hairline from 'components/layout/Hairline'
import PageFrame from 'components/layout/PageFrame'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { initProviders } from 'actions/blockchain'

import LoadingIndicator from 'components/LoadingIndicator'

import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderContainer from 'containers/HeaderContainer'
import { providerPropType } from 'utils/shapes'

import { getSelectedProvider, isConnectedToCorrectNetwork } from 'selectors/blockchain'
import initGoogleAnalytics from 'utils/analytics/init'

import './app.less'

class App extends Component {
  componentWillMount() {
    if (process.env.INTERCOM_ID) {
      window.Intercom('boot', {
        app_id: process.env.INTERCOM_ID,
      })
    }
  }

  componentDidMount() {
    initGoogleAnalytics()
    this.props.initProviders()
  }

  render() {
    const { provider } = this.props
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
        {provider && provider.account && <TransactionFloaterContainer />}
        <TransitionGroup>
          <CSSTransition key={currentKey} classNames="page-transition" timeout={timeout}>
            {this.props.children}
          </CSSTransition>
        </TransitionGroup>
        <Hairline />
        <PageFrame>
          <Footer />
        </PageFrame>
      </div>
    )
  }
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  location: PropTypes.object,
  initProviders: PropTypes.func.isRequired,
  provider: providerPropType,
}

const mapStateToProps = state => ({
  provider: getSelectedProvider(state),
  blockchainConnection: state.blockchain.connectionTried,
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

export default connect(mapStateToProps, {
  initProviders,
})(App)
