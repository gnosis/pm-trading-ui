import React from 'react'
import PropTypes from 'prop-types'
import './networkCheck.scss'

const NetworkCheck = ({ closeModal, targetNetwork, targetNetworkURL }) => (
  <div className="networkCheck">
    <a className="networkCheck__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>
      You seem to be on the wrong network.<br />In order to interact with Gnosis, please change your network to {targetNetwork ? `${targetNetwork}.` : (<code>{targetNetworkURL}</code>)}
    </h3>
    <p>You can continue to browse, but interaction will be disabled.</p>
  </div>
)

NetworkCheck.propTypes = {
  closeModal: PropTypes.func,
  targetNetwork: PropTypes.string,
  targetNetworkURL: PropTypes.string,
}

export default NetworkCheck
