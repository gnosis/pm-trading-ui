import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import autobind from 'autobind-decorator'
import { collateralTokenToText } from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import Identicon from 'components/Identicon'
import ProviderIcon from 'components/ProviderIcon'
import AccountActionsDropdown from 'components/AccountActionsDropdown'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'
import gaSend from 'utils/analytics/gaSend'

import './header.less'

class Header extends Component {
  @autobind
  handleConnectWalletClick() {
    gaSend(['event', 'Connect a wallet', 'click', 'Connect a wallet click'])
    this.props.initProviders()
  }

  render() {
    const {
      version, hasWallet, currentAccount, currentNetwork, currentBalance, currentProvider, logout,
    } = this.props
    return (
      <div className="headerContainer">
        <div className="container">
          <div className="headerContainer__group headerContainer__group--logo">
            <Link to="/">
              <div className="headerLogo beta" />
            </Link>
          </div>
          <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">
            {version}
          </div>
          <div className="headerContainer__group headerContainer__group--left navLinks">
            <Link
              to="/markets/list"
              activeClassName="headerContainer__navLink--active"
              className="headerContainer__navLink"
            >
              Markets
            </Link>
            {hasWallet && (
              <Link
                to="/dashboard"
                activeClassName="headerContainer__navLink--active"
                className="headerContainer__navLink"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/scoreboard"
              activeClassName="headerContainer__navLink--active"
              className="headerContainer__navLink"
            >
              Scoreboard
            </Link>
            <Link
              to="/gamerules"
              activeClassName="headerContainer__navLink--active"
              className="headerContainer__navLink"
            >
              Game Guide
            </Link>
          </div>

          <div className="headerContainer__group headerContainer__group--right">
            {hasWallet &&
              currentProvider && (
                <div className="headerContainer__account">
                  {currentNetwork &&
                    currentNetwork !== 'MAIN' && (
                      <span className="headerContainer__network--text">
                        Network: {upperFirst(currentNetwork.toLowerCase())}
                      </span>
                    )}
                  <DecimalValue value={currentBalance} className="headerContainer__account--text" />&nbsp;
                  <span className="headerContainer__account--text">{collateralTokenToText()}</span>
                  <ProviderIcon provider={currentProvider} />
                  <Identicon account={currentAccount} />
                  <AccountActionsDropdown onLogout={logout} />
                </div>
              )}
            {!hasWallet && (
              <a className="headerContainer__connect-wallet" onClick={this.handleConnectWalletClick}>
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
  initProviders: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

Header.defaultProps = {
  version: '',
  currentNetwork: '',
  hasWallet: false,
  currentBalance: '0',
  currentProvider: {},
  currentAccount: '',
}

export default Header
