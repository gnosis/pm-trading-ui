import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import OlympiaIcon from './metamask.svg'
import './InstallMetamask.less'

const cx = cn

const logoStyle = {
  width: 100,
  height: 100,
}

const InstallMetamask = ({ closeModal }) => (
  <div className={cx('installMetamask')}>
    <button className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={OlympiaIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('installText')}>Install MetaMask</h3>
    <p className={cx('downloadText')}>
      Metamask is not currently installed or detected.{' '}
      <a className={cx('downloadLink')} href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        Please download and install MetaMask
      </a>{' '}
      to start using Gnosis Trading Interface.
    </p>
  </div>
)

InstallMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default InstallMetamask
