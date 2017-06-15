import React from 'react'

export default ({ wallet, walletLoaded }) => {
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
      <p>Using Wallet {wallet.name}: {wallet.account} @ {wallet.network}</p>
    </div>
  )
}
