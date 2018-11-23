import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'
import cn from 'classnames/bind'
import { capitalize } from 'lodash'
import { getLogo } from 'integrations/utils'
import { WALLET_WEBSITES } from 'integrations/constants'
import { getFeatureConfig } from 'utils/features'
import css from './InstallProvider.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name } = getFeatureConfig('tournament')

const InstallProvider = ({ closeModal, providerName, t }) => {
  const downloadLink = WALLET_WEBSITES[providerName]
  const lowercaseProviderName = providerName.toLowerCase()
  const logo = lowercaseProviderName && getLogo(lowercaseProviderName)

  return (
    <div className={cx('installProvider')}>
      <button type="button" className={cx('closeButton')} onClick={closeModal} />
      <img src={logo} alt="logo" style={logoStyle} />
      <h3 className={cx('installText')}>{t('install_provider.heading', { provider: capitalize(lowercaseProviderName) })}</h3>
      <p className={cx('downloadText')}>
        <Trans key="install_provider.instructions" provider={capitalize(providerName)} application={name || t('application')}>
          {capitalize(providerName)} is not currently installed or detected.&nbsp;
          <a className={cx('downloadLink')} href={downloadLink} target="_blank" rel="noopener noreferrer">
            Please download and install {capitalize(providerName)}
          </a>{' '}
          to start using {name}.
        </Trans>
      </p>
    </div>
  )
}

InstallProvider.propTypes = {
  closeModal: PropTypes.func.isRequired,
  providerName: PropTypes.string,
  t: PropTypes.func.isRequired,
}

InstallProvider.defaultProps = {
  providerName: '',
}

export default withNamespaces()(InstallProvider)
