import React from 'react'
import PropTypes from 'prop-types'
import MetamaskIcon from 'integrations/metamask/assets/metamask-logo.svg'
import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import cn from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import { getTargetNetworkId } from 'api'
import style from './SwitchNetwork.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name: applicationName = 'the application' } = getFeatureConfig('tournament')

const targetNetworkId = getTargetNetworkId()
const targetNetwork = ETHEREUM_NETWORK_IDS[targetNetworkId]

const SwitchNetwork = ({ closeModal, targetNetworkId }) => (
  <div className={cx('switchNetwork')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>Switch to the {targetNetwork} Network</h3>
    <p className={cx('text')}>
        Your provider is not currently set to the {targetNetworkId} network. Please switch to {targetNetworkId} and make
        sure your wallet is unlocked to start using {applicationName}.
    </p>
  </div>
)

SwitchNetwork.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default SwitchNetwork
