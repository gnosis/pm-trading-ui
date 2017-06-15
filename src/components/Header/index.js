import React from 'react'

export default ({ wallet }) => wallet ? (
  <div className="header">
    <p>Using Wallet {wallet.name}: {wallet.account} @ {wallet.network}</p>
  </div>
) : (
  <div className="header">Loading Wallet...</div>
)
