import React from 'react'
import PropTypes from 'prop-types'
import ProviderIcon from 'components/ProviderIcon'
import './connectWallet.less'

const ConnectWallet = ({ closeModal }) => (
  <div className="connectWallet">
    <a className="connectWallet__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>
        In order to participate in Olympia, you need to create an identity using uPort.<br />
        Download it and refresh your browser
    </h3>
    <ul className="connectWallet__provider-list">
      <li>
        <a href="https://www.uport.me/" target="_blank" rel="noopener noreferrer">
          <ProviderIcon provider={{ name: 'uport' }} />
          uPort
        </a>
      </li>
    </ul>
  </div>
)

ConnectWallet.propTypes = {
    closeModal: PropTypes.func,
}

export default ConnectWallet
