import React from 'react'
import { withRouter } from 'react-router-dom'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import { connectBlockchain } from 'actions/blockchain'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import PageFrame from 'components/layout/PageFrame'
import Footer from 'components/Footer'
import { providerPropType } from 'utils/shapes'
import HeaderContainer from 'containers/HeaderContainer'
import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import { triedToConnect } from 'selectors/blockchain'
import { getActiveProvider, isConnectedToCorrectNetwork } from 'integrations/store/selectors'
import { isFeatureEnabled } from 'utils/features'

import style from './app.mod.scss'
import transitionStyles from './transitions.mod.scss'

const cx = cn.bind(style)

const App = (props) => {
  if (!props.blockchainConnection) {
    return (
      <div className={cx('appContainer')}>
        <div className={cx('loader-container')}>
          <IndefiniteSpinner width={100} height={100} />
          <h1>Connecting</h1>
        </div>
      </div>
    )
  }

  const timeout = { enter: 300, exit: 300 }
  const transitionClassNames = {
    enter: transitionStyles.enter,
    enterActive: transitionStyles.enterActive,
    exit: transitionStyles.exit,
    exitActive: transitionStyles.exitActive,
  }

  return (
    <div className={cx('appContainer')}>
      <HeaderContainer version={process.env.VERSION} />
      {props.provider && props.provider.account && <TransactionFloaterContainer />}
      <TransitionGroup>
        <CSSTransition key={props.location.pathname.split('/')[1]} classNames={transitionClassNames} timeout={timeout}>
          {props.children}
        </CSSTransition>
      </TransitionGroup>
      {isFeatureEnabled('footer') && (
        <PageFrame>
          <Footer />
        </PageFrame>
      )}
    </div>
  )
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  location: PropTypes.shape({
    key: PropTypes.string,
    hash: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
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
