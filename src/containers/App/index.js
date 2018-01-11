import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Footer from 'components/Footer'
import Hairline from 'components/layout/Hairline'
import PageFrame from 'components/layout/PageFrame'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import HeaderRewardStatusContainer from 'containers/HeaderRewardStatusContainer'
import HeaderContainer from 'containers/HeaderContainer'
import { providerPropType } from 'utils/shapes'

import { getSelectedProvider, isConnectedToCorrectNetwork, isGnosisInitialized } from 'selectors/blockchain'


import './app.less'

class App extends Component {
  componentWillMount() {
    if (process.env.INTERCOM_ID) {
      window.Intercom('boot', {
        app_id: process.env.INTERCOM_ID,
      })
    }
  }

  render() {
    const { provider, connected } = this.props

    const currentKey = this.props.location.pathname.split('/')[2] || this.props.location.pathname.split('/')[1] || '/'
    const timeout = { enter: 200, exit: 200 }

    const connectionEstablishedWithAccount = connected && provider && provider.account

    return (
      <div className="appContainer">
        {connectionEstablishedWithAccount && <HeaderRewardStatusContainer />}
        <HeaderContainer version={`${process.env.TRAVIS_BRANCH || 'development'}-${process.env.TRAVIS_BUILD_ID || 'snapshot'}`} />
        {connectionEstablishedWithAccount && <TransactionFloaterContainer />}
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
  children: PropTypes.node,
  location: PropTypes.shape({
    params: PropTypes.object,
    pathname: PropTypes.string,
  }),
  provider: providerPropType,
  connected: PropTypes.bool,
}

App.defaultProps = {
  children: undefined,
  location: {},
  provider: undefined,
  connected: false,
}

const mapStateToProps = state => ({
  provider: getSelectedProvider(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
  connected: isGnosisInitialized(state),
})

export default connect(mapStateToProps)(App)
