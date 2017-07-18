import React from 'react'
import { Link } from 'react-router'

import './header.less'
import logo from 'assets/img/gnosis_logo.svg'

export default ({ wallet, walletLoaded }) => {
  /*
  if (!walletLoaded) {
    return (
      <div className="header">
        <p>Loading wallet...</p>
      </div>
    )
  } else if (!wallet) {
    return (
      <div className="header">
        <p>No wallet available.</p>
      </div>
    )
  }

  return (
    <div className="header">
      <p>Connected via {wallet.name.toLowerCase()}</p>
    </div>
  )*/
  return (
    <div className="headerContainer">
      <div className="container">
        <div className="headerContainer__group headerContainer__group--logo">
          <Link to="/">
            <img src={logo} alt="GNOSIS" className="headerLogo" />
          </Link>
        </div>
        <div className="headerContainer__group headerContainer__group--left">
          <Link to="/dashboard" className="headerContainer__navLink">Dashboard</Link>
          <Link to="/markets/list" className="headerContainer__navLink">Markets</Link>
          <Link to="/transactions" className="headerContainer__navLink">Transactions</Link>
        </div>
        <div className="headerContainer__group headerContainer__group--right">
          <Link to="/account" className="headerContainer__navLink">Account</Link>
          <Link to="/settings" className="headerContainer__navLink">Settings</Link>
        </div>
      </div>
    </div>
  )
}
