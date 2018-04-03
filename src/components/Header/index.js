import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'
import className from 'classnames/bind'

import Identicon from './Identicon'
import ProviderIcon from './ProviderIcon'
import MenuAccountDropdown from './MenuAccountDropdown'

import css from './Header.scss'

const cx = className.bind(css)

class Header extends Component {
  @autobind
  handleConnectWalletClick() {
    this.props.openConnectWalletModal()
  }

  render() {
    const {
      version,
      hasWallet,
      currentAccount,
      currentNetwork,
      currentBalance,
      currentProvider,
      isTournament,
      logoPath,
      smallLogoPath,
      showScoreboard,
      showGameGuide,
      gameGuideType,
      gameGuideURL,
      tokenAddress,
    } = this.props

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
            {hasWallet && (
              <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
              Markets
            </NavLink>
            {hasWallet && (
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
            {hasWallet &&
              currentProvider && (
              <div className={cx('account')}>
                {currentNetwork &&
                    currentNetwork !== 'MAIN' && (
                    <span className={cx('network', 'text')}>Network: {upperFirst(currentNetwork.toLowerCase())}</span>
                )}
                <DecimalValue value={currentBalance} className={cx('balance', 'test')} />&nbsp;
                <CurrencyName className={cx('account', 'text')} tokenAddress={tokenAddress} />
                <ProviderIcon provider={currentProvider} />
                <Identicon account={currentAccount} />
                <MenuAccountDropdown />
              </div>
            )}
            {!hasWallet && (
              <a className={cx('connect-wallet')} onClick={this.handleConnectWalletClick}>
                Connect a wallet
              </a>
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
  currentBalance: PropTypes.string,
  currentProvider: providerPropType,
  currentAccount: PropTypes.string,
  openConnectWalletModal: PropTypes.func.isRequired,
  isTournament: PropTypes.bool,
  logoPath: PropTypes.string.isRequired,
  smallLogoPath: PropTypes.string.isRequired,
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenAddress: PropTypes.string.isRequired,
}

Header.defaultProps = {
  version: '',
  currentNetwork: '',
  hasWallet: false,
  currentBalance: '0',
  currentProvider: {},
  currentAccount: '',
  isTournament: false,
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
}

export default Header
