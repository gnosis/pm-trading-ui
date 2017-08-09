import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import logo from 'assets/img/gnosis_logo.svg'
import './header.less'

const Header = ({ version, defaultAccount }) => (
  <div className="headerContainer">
    <div className="container">
      <div className="headerContainer__group headerContainer__group--logo">
        <Link to="/">
          <img src={logo} alt="GNOSIS" className="headerLogo" />
        </Link>
      </div>
      <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">{version}</div>
      <div className="headerContainer__group headerContainer__group--left">
        <Link to="/dashboard" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">Dashboard</Link>
        <Link to="/markets/list" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">Markets</Link>
        {defaultAccount && <Link to="/transactions" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">Transactions</Link>}
      </div>
      <div className="headerContainer__group headerContainer__group--right">
        {defaultAccount && <Link to="/account" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">Account</Link>}
        <Link to="/settings" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">Settings</Link>
      </div>
    </div>
  </div>
)

Header.propTypes = {
  version: PropTypes.string,
}

export default Header
