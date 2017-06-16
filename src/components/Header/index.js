import React from 'react'
import { Link } from 'react-router'

import './header.less'

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
      <Link to="/dashboard" className="headerContainer__navLink">Home</Link>
      <Link to="/markets/list" className="headerContainer__navLink">Markets</Link>
      <Link to="/settings" className="headerContainer__navLink">Settings</Link>
    </div>
  )
}
