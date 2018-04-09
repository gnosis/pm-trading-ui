import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getTournamentName } from 'utils/configuration'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import css from './UnlockMetamask.mod.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const tournamentName = getTournamentName()

const UnlockMetamask = ({ closeModal }) => (
  <div className={cx('unlockMetamask')}>
    <button className={cx('closeButton')} onClick={closeModal} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>Unlock your MetaMask wallet</h3>
    <p className={cx('text')}>Please unlock your MetaMask wallet to start using {tournamentName}.</p>
  </div>
)

UnlockMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default UnlockMetamask
