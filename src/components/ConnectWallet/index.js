import React from 'react'
import PropTypes from 'prop-types'
import './connectWallet.less'

const ConnectWallet = ({ closeModal, getProviderIcon }) => (
  <div className="connectWallet">
    <a className="connectWallet__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>In order to interact with Gnosis you need an Ethereum Wallet.<br />We currently support these providers:</h3>
    <ul className="connectWallet__provider-list">
      <li>
        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
          {getProviderIcon('METAMASK')}
          MetaMask
        </a>
      </li>
      <li>
        <a href="https://github.com/ethereum/mist" target="_blank" rel="noopener noreferrer">
          {getProviderIcon('Mist')}
          Mist
        </a>
      </li>
    </ul>
  </div>
)

ConnectWallet.propTypes = {
  closeModal: PropTypes.func,
}

export default ConnectWallet
