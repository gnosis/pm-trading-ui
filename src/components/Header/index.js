import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import { collateralTokenToText } from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import Identicon from 'components/Identicon'
import ProviderIcon from 'components/ProviderIcon'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import MenuAccountDropdown from './MenuAccountDropdown'

import './header.scss'

class Header extends Component {
  @autobind
  handleConnectWalletClick() {
    this.props.openConnectWalletModal()
  }

  render() {
    const {
      version, hasWallet, currentAccount, currentNetwork, currentBalance, currentProvider,
    } = this.props
    return (
      <div className="headerContainer">
        <div className="container">
          <div className="headerContainer__group headerContainer__group--logo">
            <NavLink to="/markets/list">
              <div className="headerLogo beta" />
            </NavLink>
          </div>
          <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">
            {version}
          </div>
          <div className="headerContainer__group headerContainer__group--left navLinks">
            {hasWallet && (
              <NavLink
                to="/dashboard"
                activeClassName="headerContainer__navLink--active"
                className="headerContainer__navLink"
              >
                Dashboard
              </NavLink>
            )}
            <NavLink
              to="/markets/list"
              activeClassName="headerContainer__navLink--active"
              className="headerContainer__navLink"
            >
              Markets
            </NavLink>
            {hasWallet && (
              <NavLink
                to="/transactions"
                activeClassName="headerContainer__navLink--active"
                className="headerContainer__navLink"
              >
                Transactions
              </NavLink>
            )}
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
                  <MenuAccountDropdown />
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
  openConnectWalletModal: PropTypes.func.isRequired,
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
