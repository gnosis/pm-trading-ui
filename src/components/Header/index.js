import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import autobind from 'autobind-decorator'
import Layout from 'components/Header/Layouts'
import { providerPropType } from 'utils/shapes'
import { isFeatureEnabled, getFeatureConfig } from 'utils/features'
import { hasMetamask } from 'integrations/metamask/utils'
import { WALLET_PROVIDER } from 'integrations/constants'

const tournamentEnabled = isFeatureEnabled('tournament')
const badgesEnabled = isFeatureEnabled('badges')
const requireRegistration = isFeatureEnabled('registration')
const requireVerification = isFeatureEnabled('verification')
const providerConfig = getFeatureConfig('providers')
const legalComplianceEnabled = isFeatureEnabled('legalCompliance')
const { default: defaultProvider } = providerConfig

const useMetamask = defaultProvider === WALLET_PROVIDER.METAMASK
const useUport = defaultProvider === WALLET_PROVIDER.UPORT

const BALANCE_FETCH_INTERVAL = 5000

class Header extends Component {
  componentDidMount() {
    const {
      currentAccount, requestMainnetAddress, requestTokenBalance, fetchTournamentUserData,
    } = this.props

    if (requireRegistration && currentAccount) {
      requestMainnetAddress()
    }

    if (currentAccount) {
      requestTokenBalance(currentAccount)
      this.balanceFetcher = setInterval(() => requestTokenBalance(currentAccount), BALANCE_FETCH_INTERVAL)

      if (tournamentEnabled) {
        fetchTournamentUserData(currentAccount)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentAccount, requestTokenBalance, requestMainnetAddress, fetchTournamentUserData,
    } = this.props
    // If user unlocks metamask, changes his account, we need to check if the account was registered
    const shouldRequestMainnetAddress = requireRegistration && currentAccount !== prevProps.currentAccount
    if (shouldRequestMainnetAddress && currentAccount) {
      clearInterval(this.balanceFetcher)
      this.balanceFetcher = setInterval(() => requestTokenBalance(currentAccount), BALANCE_FETCH_INTERVAL)
      requestMainnetAddress()
      fetchTournamentUserData(currentAccount)
    }
  }

  @autobind
  async handleConnectWalletClick() {
    const {
      isConnectedToCorrectNetwork, lockedMetamask, acceptedTOS, openModal, initUport,
    } = this.props

    const shouldInstallProviders = !hasMetamask() && !useUport
    const shouldAcceptTOS = !acceptedTOS || !legalComplianceEnabled

    if (shouldInstallProviders) {
      openModal('ModalInstallMetamask')
    } else if (useMetamask) {
      if (lockedMetamask) {
        openModal('ModalUnlockMetamask')
      } else if (!isConnectedToCorrectNetwork) {
        openModal('ModalSwitchNetwork')
      } else if (requireVerification) {
        // Verification has to implement the modals below:
        // - Registration
        // - Accept TOS
        openModal('ModalVerification')
      } else if (requireRegistration) {
        // Registration has to implement the modals below
        // - Accept TOS
        openModal('ModalRegisterWallet')
      } else if (shouldAcceptTOS) {
        openModal('ModalAcceptTOS')
      } else {
        console.warn('should be connected, try refresh')
        window.location.reload()
      }
    } else if (useUport) {
      initUport()
    }
  }

  render() {
    const {
      hasWallet,
      currentProvider,
      logoPath,
      smallLogoPath,
      mainnetAddress,
      acceptedTOS,
      hasVerified,
    } = this.props

    let canInteract = (acceptedTOS || !legalComplianceEnabled)
      && (hasVerified || !requireVerification)
      && hasWallet
      && !!currentProvider

    if (tournamentEnabled && useMetamask && requireRegistration) {
      canInteract = hasWallet && !!mainnetAddress
    }

    const logoVars = {}
    logoVars['--logoPath'] = `url("${logoPath}")`
    logoVars['--smallLogoPath'] = `url("${smallLogoPath}")`

    return (
      <Layout
        {...this.props}
        logoVars={logoVars}
        handleConnectWalletClick={this.handleConnectWalletClick}
        canInteract={canInteract}
        badgesEnabled={badgesEnabled}
      />
    )
  }
}

Header.propTypes = {
  currentNetwork: PropTypes.string,
  hasWallet: PropTypes.bool,
  etherBalance: PropTypes.string,
  tokenBalance: PropTypes.string,
  tokenBalanceIsWrappedEther: PropTypes.bool,
  currentProvider: providerPropType,
  currentAccount: PropTypes.string,
  userTournamentInfo: PropTypes.shape({}),
  logoPath: PropTypes.string.isRequired,
  smallLogoPath: PropTypes.string.isRequired,
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenSymbol: PropTypes.string,
  lockedMetamask: PropTypes.bool,
  requestMainnetAddress: PropTypes.func.isRequired,
  requestTokenBalance: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
  initUport: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  acceptedTOS: PropTypes.bool,
  hasVerified: PropTypes.bool,
  fetchTournamentUserData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

Header.defaultProps = {
  currentNetwork: '',
  hasWallet: false,
  tokenBalance: '0',
  etherBalance: '0',
  currentProvider: {},
  currentAccount: '',
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
  mainnetAddress: undefined,
  lockedMetamask: true,
  userTournamentInfo: undefined,
  tokenSymbol: 'ETH',
  tokenBalanceIsWrappedEther: false,
  acceptedTOS: false,
  hasVerified: false,
}

export default withNamespaces()(Header)
