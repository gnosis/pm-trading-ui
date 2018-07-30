import React from 'react'
import PropTypes from 'prop-types'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import cn from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import style from './SwitchNetwork.mod.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name: applicationName = 'the application' } = getFeatureConfig('tournament')

const SwitchNetwork = ({ closeModal, targetNetwork }) => (
  <div className={cx('switchNetwork')}>
    <button className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>Switch to the {targetNetwork} Network</h3>
    <p className={cx('text')}>
      Your provider is not currently set to the {targetNetwork} network. Please switch to {targetNetwork} and make sure
      your wallet is unlocked to start using {applicationName}
      .
    </p>
  </div>
)

SwitchNetwork.propTypes = {
  closeModal: PropTypes.func.isRequired,
  targetNetwork: PropTypes.string.isRequired,
}

export default SwitchNetwork
