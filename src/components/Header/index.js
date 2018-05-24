import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import { upperFirst } from 'lodash'
import className from 'classnames/bind'
import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { providerPropType } from 'utils/shapes'
import { isFeatureEnabled, getFeatureConfig } from 'utils/features'
import { hasMetamask } from 'integrations/metamask/utils'
import { WALLET_PROVIDER } from 'integrations/constants'

import Identicon from './Identicon'
import ProviderIcon from './ProviderIcon'
import BadgeIcon from './BadgeIcon'
import MenuAccountDropdown from './MenuAccountDropdown'

import css from './Header.scss'

const cx = className.bind(css)

const tournamentEnabled = isFeatureEnabled('tournament')
const badgesEnabled = isFeatureEnabled('badges')
const requireRegistration = isFeatureEnabled('registration')
const providerConfig = getFeatureConfig('providers')
const requireTOSAccept = !!providerConfig.requireTOSAccept
const { default: defaultProvider } = providerConfig

const useMetamask = defaultProvider === WALLET_PROVIDER.METAMASK
const useUport = defaultProvider === WALLET_PROVIDER.UPORT

class Header extends Component {
  componentDidMount() {
    if (requireRegistration && this.props.currentAccount) {
      this.props.requestMainnetAddress()
    }

    if (this.props.currentAccount) {
      this.props.requestTokenBalance(this.props.currentAccount)
    }
  }

  componentDidUpdate(prevProps) {
    // If user unlocks metamask, changes his account, we need to check if the account was registered
    const shouldRequestMainnetAddress =
    requireRegistration && this.props.currentAccount !== prevProps.currentAccount
    if (shouldRequestMainnetAddress) {
      this.props.requestMainnetAddress()
    }
  }

  @autobind
  async handleConnectWalletClick() {
    const { isConnectedToCorrectNetwork, lockedMetamask, acceptedTOS } = this.props

    const shouldInstallProviders = !hasMetamask() && !useUport
    const shouldAcceptTOS = requireTOSAccept && !acceptedTOS

    if (shouldInstallProviders) {
      this.props.openModal('ModalInstallMetamask')
    } else if (useMetamask) {
      if (lockedMetamask) {
        this.props.openModal('ModalUnlockMetamask')
      } else if (!isConnectedToCorrectNetwork) {
        this.props.openModal('ModalSwitchNetwork')
      } else if (shouldAcceptTOS) {
        this.props.openModal('ModalAcceptTOS')
      } else if (requireRegistration) {
        this.props.openModal('ModalRegisterWallet')
      } else {
        console.warn('should be connected')
      }
    } else if (useUport) {
      this.props.initUport()
    }
  }

  render() {
    const {
      version,
      hasWallet,
      currentAccount,
      currentNetwork,
      tokenBalance,
      currentProvider,
      logoPath,
      smallLogoPath,
      showScoreboard,
      showGameGuide,
      gameGuideType,
      gameGuideURL,
      tokenAddress,
      mainnetAddress,
      userTournamentInfo,
      acceptedTOS,
    } = this.props

    let walletConnected = hasWallet

    if (tournamentEnabled && useMetamask && requireRegistration) {
      walletConnected = hasWallet && !!mainnetAddress
    }


    const logoVars = {}
    logoVars['--logoPath'] = `url("${logoPath}")`
    logoVars['--smallLogoPath'] = `url("${smallLogoPath}")`

    let gameGuideLink = <div />
    if (showGameGuide) {
      if (gameGuideType === 'default') {
        gameGuideLink = (
          <NavLink to="/game-guide" activeClassName={cx('active')} className={cx('navLink')}>
            Game guide
          </NavLink>
        )
      }

      if (gameGuideType === 'link') {
        gameGuideLink = (
          <a href={gameGuideURL} className={cx('navLink')} target="_blank">
            Game Guide
          </a>
        )
      }
    }

    const canInteract = (!requireTOSAccept || acceptedTOS) && walletConnected && currentProvider

    return (
      <div className={cx('headerContainer')}>
        <div className={cx('container')}>
          <div className={cx('group', 'logo')}>
            <NavLink to="/markets/list">
              <div className={cx('headerLogo', 'beta')} style={logoVars} />
            </NavLink>
          </div>
          <div className={cx('group', 'left', 'version')}>{version}</div>
          <div className={cx('group', 'left', 'navLinks')}>
            {canInteract && (
              <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
              Markets
            </NavLink>
            {canInteract && (
              <NavLink to="/transactions" activeClassName={cx('active')} className={cx('navLink')}>
                Transactions
              </NavLink>
            )}
            {showScoreboard && (
              <NavLink to="/scoreboard" activeClassName={cx('active')} className={cx('navLink')}>
                Scoreboard
              </NavLink>
            )}
            {gameGuideLink}
          </div>

          <div className={cx('group', 'right')}>
            {canInteract ? (
              <div className={cx('account')}>
                {currentNetwork && currentNetwork !== 'MAIN' && (
                  <span className={cx('network', 'text')}>Network: {upperFirst(currentNetwork.toLowerCase())}</span>
                )}
                <DecimalValue value={tokenBalance} className={cx('balance', 'test')} />&nbsp;
                {tokenAddress ? <CurrencyName className={cx('account', 'text')} tokenAddress={tokenAddress} /> : <span>ETH</span>}
                {badgesEnabled && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
                <ProviderIcon provider={currentProvider} />
                <Identicon account={currentAccount} />
                {useUport && <MenuAccountDropdown />}
              </div>
            ) : (
              <button className={cx('connect-wallet')} onClick={this.handleConnectWalletClick}>
                Connect a wallet
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  version: PropTypes.string,
  currentNetwork: PropTypes.string,
  hasWallet: PropTypes.bool,
  tokenBalance: PropTypes.string,
  currentProvider: providerPropType,
  currentAccount: PropTypes.string,
  userTournamentInfo: PropTypes.shape({}),
  logoPath: PropTypes.string.isRequired,
  smallLogoPath: PropTypes.string.isRequired,
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenAddress: PropTypes.string,
  lockedMetamask: PropTypes.bool,
  requestMainnetAddress: PropTypes.func.isRequired,
  requestTokenBalance: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
  initUport: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  acceptedTOS: PropTypes.bool,
}

Header.defaultProps = {
  version: '',
  currentNetwork: '',
  hasWallet: false,
  tokenBalance: '0',
  currentProvider: {},
  currentAccount: '',
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
  mainnetAddress: undefined,
  lockedMetamask: true,
  userTournamentInfo: undefined,
  tokenAddress: undefined,
  acceptedTOS: false,
}

export default Header
