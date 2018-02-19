import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import { collateralTokenToText } from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'
import className from 'classnames'

import Identicon from './Identicon'
import ProviderIcon from './ProviderIcon'
import MenuAccountDropdown from './MenuAccountDropdown'

import styles from './Header.scss'

const cx = className.bind(styles)

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
      <div className={cx('headerContainer')}>
        <div className={cx('container')}>
          <div className={cx('group', 'logo')}>
            <NavLink to="/">
              <div className={cx('headerLogo', 'beta')} />
            </NavLink>
          </div>
          <div className={cx('group', 'left', 'version')}>
            {version}
          </div>
          <div className={cx('group', 'left', 'navLinks')}>
            {hasWallet && (
              <NavLink
                to="/dashboard"
                activeClassName={cx('navLink', 'active')}
                className={cx('navLink')}
              >
                Dashboard
              </NavLink>
            )}
            <NavLink
              to="/markets/list"
              activeClassName={cx('navLink', 'active')}
              className={cx('navLink')}
            >
              Markets
            </NavLink>
            {hasWallet && (
              <NavLink
                to="/transactions"
                activeClassName={cx('navLink', 'active')}
                className={cx('navLink')}
              >
                Transactions
              </NavLink>
            )}
          </div>

          <div className={cx('group', 'right')}>
            {hasWallet &&
              currentProvider && (
                <div className={cx('account')}>
                  {currentNetwork &&
                    currentNetwork !== 'MAIN' && (
                      <span className={cx('network', 'text')}>
                        Network: {upperFirst(currentNetwork.toLowerCase())}
                      </span>
                    )}
                  <DecimalValue value={currentBalance} className={cx('balance', 'test')} />&nbsp;
                  <span className={cx('account', 'text')}>{collateralTokenToText()}</span>
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
