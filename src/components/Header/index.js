import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import DecimalValue from 'components/DecimalValue'
import Identicon from 'components/Identicon'
import ProviderIcon from 'components/ProviderIcon'
import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import './header.less'

const Header = ({
  version,
  currentAccount,
  currentNetwork,
  currentBalance,
  currentProvider,
  getProviderIcon,
  openConnectWalletModal,
}) => (
  <div className="headerContainer">
    <div className="container">
      <div className="headerContainer__group headerContainer__group--logo">
        <Link to={currentAccount ? '/' : '/markets/list'}>
          <div className="headerLogo" />
        </Link>
      </div>
      <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">
        {version}
      </div>
      <div className="headerContainer__group headerContainer__group--left">
        {currentAccount && (
          <Link to="/dashboard" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">
            Dashboard
          </Link>
        )}
        <Link
          to="/markets/list"
          activeClassName="headerContainer__navLink--active"
          className="headerContainer__navLink"
        >
          Markets
        </Link>
        {currentAccount && (
          <Link
            to="/transactions"
            activeClassName="headerContainer__navLink--active"
            className="headerContainer__navLink"
          >
            Transactions
          </Link>
        )}
      </div>

      <div className="headerContainer__group headerContainer__group--right account">
        {currentAccount && currentProvider && getProviderIcon(currentProvider)}
        {currentAccount &&
          currentProvider && (
            <div className="headerContainer__account">
              {currentNetwork &&
                currentNetwork !== 'MAIN' && (
                  <span className="headerContainer__network--text">
                    Network: {upperFirst(currentNetwork.toLowerCase())}
                  </span>
                )}
              <DecimalValue value={currentBalance} className="headerContainer__account--text" />&nbsp;<span className="headerContainer__account--text">ETH</span>
              <Identicon className="" />
            </div>
          )}
        {currentAccount && currentProvider && <ProviderIcon provider={currentProvider} />}
        {!currentAccount && (
          <a className="headerContainer__connect-wallet" onClick={() => openConnectWalletModal()}>
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
  currentAccount: PropTypes.string,
  currentBalance: PropTypes.string,
  currentProvider: providerPropType,
  getProviderIcon: PropTypes.func,
  openConnectWalletModal: PropTypes.func,
}

export default Header
