import React from 'react'
import PropTypes from 'prop-types'
import ProviderIcon from 'components/Header/ProviderIcon'
import './connectWallet.scss'

const ConnectWallet = ({ closeModal }) => (
  <div className="connectWallet">
    <a className="connectWallet__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>
      In order to interact with Gnosis you need an Ethereum Wallet.<br />We currently support these providers:
    </h3>
    <ul className="connectWallet__provider-list">
      <li>
        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
          <ProviderIcon provider={{ name: 'METAMASK' }} />
          MetaMask
        </a>
      </li>
      <li>
        <a href="https://www.parity.io/" target="_blank" rel="noopener noreferrer">
          <ProviderIcon provider={{ name: 'PARITY' }} />
          Parity
        </a>
      </li>
    </ul>
  </div>
)

ConnectWallet.propTypes = {
  closeModal: PropTypes.func,
}

export default ConnectWallet
