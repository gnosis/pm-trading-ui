import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import { upperFirst } from 'lodash'
import className from 'classnames/bind'
import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { providerPropType } from 'utils/shapes'
import { shouldUseMetamask, shouldUseUport, areBadgesEnabled } from 'utils/configuration'
import { hasMetamask } from 'integrations/metamask/utils'

import Identicon from './Identicon'
import ProviderIcon from './ProviderIcon'
import BadgeIcon from './BadgeIcon'
import MenuAccountDropdown from './MenuAccountDropdown'

import css from './Header.scss'

const cx = className.bind(css)

const [useMetamask, useUport] = [shouldUseMetamask(), shouldUseUport()]

class Header extends Component {
  componentDidMount() {
    if (this.props.isTournament && this.props.currentAccount) {
      this.props.requestMainnetAddress()
    }

    if (this.props.currentAccount) {
      this.props.requestTokenBalance(this.props.currentAccount)
    }
  }

  componentDidUpdate(prevProps) {
    // If user unlocks metamask, changes his account, we need to check if the account was registered
    const shouldRequestMainnetAddress =
      this.props.isTournament && this.props.currentAccount !== prevProps.currentAccount
    if (shouldRequestMainnetAddress) {
      this.props.requestMainnetAddress()
    }
  }

  @autobind
  async handleConnectWalletClick() {
    const { isConnectedToCorrectNetwork, lockedMetamask } = this.props
    if (!hasMetamask() && !useUport) {
      this.props.openModal('ModalInstallMetamask')
    } else if (useMetamask) {
      if (lockedMetamask) {
        this.props.openModal('ModalUnlockMetamask')
      } else if (!isConnectedToCorrectNetwork) {
        this.props.openModal('ModalSwitchNetwork')
      } else {
        this.props.openModal('ModalRegisterWallet')
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
      isTournament,
      logoPath,
      smallLogoPath,
      showScoreboard,
      showGameGuide,
      gameGuideType,
      gameGuideURL,
      tokenAddress,
      mainnetAddress,
      userTournamentInfo,
    } = this.props

    let walletConnected = hasWallet
    if (isTournament && useMetamask) {
      walletConnected = hasWallet && mainnetAddress
    }

    const logoVars = {}
    if (isTournament) {
      logoVars['--logoAnnotation'] = "'Powered by Gnosis'"
      logoVars['--logoPath'] = `url("${logoPath}")`
      logoVars['--smallLogoPath'] = `url("${smallLogoPath}")`
    }

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
            {walletConnected && (
              <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
              Markets
            </NavLink>
            {walletConnected && (
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
            {walletConnected && currentProvider && (
              <div className={cx('account')}>
                {currentNetwork && currentNetwork !== 'MAIN' && (
                  <span className={cx('network', 'text')}>Network: {upperFirst(currentNetwork.toLowerCase())}</span>
                )}
                <DecimalValue value={tokenBalance} className={cx('balance', 'test')} />&nbsp;
                {tokenAddress ? <CurrencyName className={cx('account', 'text')} tokenAddress={tokenAddress} /> : <span>ETH</span>}
                {areBadgesEnabled() && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
                <ProviderIcon provider={currentProvider} />
                <Identicon account={currentAccount} />
                {useUport && <MenuAccountDropdown />}
              </div>
            )}
            {!walletConnected && (
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
  isTournament: PropTypes.bool,
  userTournamentInfo: PropTypes.shape({}),
  logoPath: PropTypes.string.isRequired,
  smallLogoPath: PropTypes.string.isRequired,
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenAddress: PropTypes.string.isRequired,
  lockedMetamask: PropTypes.bool,
  requestMainnetAddress: PropTypes.func.isRequired,
  requestTokenBalance: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
  initUport: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

Header.defaultProps = {
  version: '',
  currentNetwork: '',
  hasWallet: false,
  tokenBalance: '0',
  currentProvider: {},
  currentAccount: '',
  isTournament: false,
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
  mainnetAddress: undefined,
  lockedMetamask: true,
  userTournamentInfo: undefined,
}

export default Header
