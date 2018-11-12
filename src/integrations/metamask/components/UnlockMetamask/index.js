import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import MetamaskIcon from 'integrations/metamask/assets/metamask-logo.svg'
import css from './UnlockMetamask.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const tournamentConfig = getFeatureConfig('tournament')

const UnlockMetamask = ({ closeModal }) => (
  <div className={cx('unlockMetamask')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>Unlock your MetaMask wallet</h3>
    <p className={cx('text')}>
      Please accept connecting your MetaMask account to start using {tournamentConfig.name || 'the application'}. Your
      wallet needs to be unlocked.
    </p>
  </div>
)

UnlockMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default UnlockMetamask
