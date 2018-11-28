import React from 'react'
import PropTypes from 'prop-types'
import { Trans, withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import { getFeatureConfig } from 'utils/features'
import css from './InstallMetamask.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name } = getFeatureConfig('tournament')

const InstallMetamask = ({ closeModal, t }) => (
  <div className={cx('installMetamask')}>
    <button type="button" className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('installText')}>{t('metamask.install_metamask')}</h3>
    <p className={cx('downloadText')}>
      <Trans key="metamask.missing" name={name || t('application')}>
        Metamask is not currently installed or detected.&nbsp;
        <a className={cx('downloadLink')} href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
          Please download and install MetaMask
        </a>&nbsp;
        to start using {name || t('application')}.
      </Trans>

    </p>
  </div>
)

InstallMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default withNamespaces()(InstallMetamask)
