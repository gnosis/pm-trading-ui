import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { collateralTokenToText } from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import Identicon from 'components/Identicon'
import ProviderIcon from 'components/ProviderIcon'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import './header.less'

const Header = ({
  version,
  hasWallet,
  currentNetwork,
  currentBalance,
  currentProvider,
  openConnectWalletModal,
}) => (
  <div className="headerContainer">
    <div className="container">
      <div className="headerContainer__group headerContainer__group--logo">
        <Link to={hasWallet ? '/' : '/markets/list'}>
          <div className="headerLogo beta" />
        </Link>
      </div>
      <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">
        {version}
      </div>
      <div className="headerContainer__group headerContainer__group--left">
        <Link
          to="/markets/list"
          activeClassName="headerContainer__navLink--active"
          className="headerContainer__navLink"
        >
          Markets
        </Link>
        {hasWallet && (
          <Link to="/dashboard" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">
            Dashboard
          </Link>
        )}
        <Link to="/scoreboard" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">
          Scoreboard
        </Link>
        <Link to="/gamerules" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">
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
              <span className="headerContainer__account--text">
                { collateralTokenToText() }
              </span>
              <ProviderIcon provider={currentProvider} />
              <Identicon className="" />
            </div>
        )}
        {!hasWallet && (
          <a
            href="javascript:void(0)"
            className="headerContainer__connect-wallet"
            onClick={() => openConnectWalletModal()}
          >
            Connect a wallet
          </a>
        )}
      </div>
    </div>
  </div>
)

Header.propTypes = {
    version: PropTypes.string,
    currentNetwork: PropTypes.string,
    hasWallet: PropTypes.bool,
    currentBalance: PropTypes.string,
    currentProvider: providerPropType,
    openConnectWalletModal: PropTypes.func,
}

export default Header
