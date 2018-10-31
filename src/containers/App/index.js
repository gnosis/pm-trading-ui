import React from 'react'
import { withRouter } from 'react-router-dom'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import Cookies from 'js-cookie'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import { withNamespaces } from 'react-i18next'

import IndefiniteSpinner from 'components/Spinner/Indefinite'
import Footer from 'components/Footer'
import CookieBannerContainer from 'containers/CookieBannerContainer'
import { providerPropType } from 'utils/shapes'
import { getHtmlConfig, isFeatureEnabled } from 'utils/features'
import HeaderContainer from 'containers/HeaderContainer'
import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import EnableIntercom from 'containers/EnableIntercom'
import { isConnectedToBlockchain } from 'store/selectors/blockchain'
import { getActiveProvider, isConnectedToCorrectNetwork } from 'integrations/store/selectors'
import { changeUiState } from 'store/actions/interface'
import { getUiState } from 'store/selectors/interface'

import 'normalize.css'
import style from './app.scss'
import transitionStyles from './transitions.scss'
import 'rc-tooltip/assets/bootstrap.css?raw'

if (isFeatureEnabled('tournament')) {
  import('react-table/react-table.css?raw')
}

const cx = cn.bind(style)

const App = (props) => {
  const {
    provider, blockchainConnection, children, location, intercomReminderVisible, modal, t,
  } = props

  const isModalOpen = modal.get('isOpen', false)

  if (!blockchainConnection) {
    return (
      <div className={cx('appContainer')}>
        <div className={cx('loader-container')}>
          <IndefiniteSpinner width={100} height={100} />
          <h1>{t('connecting_blockchain')}</h1>
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
      {isFeatureEnabled('cookieBanner') && <CookieBannerContainer />}
      <HeaderContainer />
      {provider && provider.account && !isModalOpen && <TransactionFloaterContainer />}
      <TransitionGroup>
        <CSSTransition key={location.pathname.split('/')[1]} classNames={transitionClassNames} timeout={timeout}>
          {children}
        </CSSTransition>
      </TransitionGroup>
      {intercomReminderVisible && <EnableIntercom />}
      <Footer version={process.env.VERSION} />
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
  intercomReminderVisible: PropTypes.bool,
  t: PropTypes.func.isRequired,
  modal: PropTypes.shape({
    isOpen: PropTypes.bool,
  }).isRequired,
}

App.defaultProps = {
  blockchainConnection: false,
  children: <div />,
  location: {},
  provider: {},
  intercomReminderVisible: false,
}

const mapStateToProps = state => ({
  provider: getActiveProvider(state),
  blockchainConnection: isConnectedToBlockchain(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
  intercomReminderVisible: getUiState(state, 'showIntercomReminder'),
  modal: state.modal,
})

const mapDispatchToProps = dispatch => ({
  changeIntercomReminderVisibility: () => dispatch(changeUiState({ showIntercomReminder: true })),
})

const enhancer = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { changeIntercomReminderVisibility } = this.props
      document.title = getHtmlConfig().title || 'Gnosis Trading Interface'

      if (Cookies.get('Chat support') === 'no') {
        changeIntercomReminderVisibility(true)
      }
    },
  }),
  withNamespaces(),
)

export default enhancer(App)
