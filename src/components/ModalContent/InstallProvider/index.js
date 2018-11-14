import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getLogo } from 'integrations/utils'
import { WALLET_WEBSITES } from 'integrations/constants'
import { getFeatureConfig } from 'utils/features'
import css from './InstallProvider.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name = 'the application' } = getFeatureConfig('tournament')

const InstallProvider = ({ closeModal, providerName }) => {
  const downloadLink = WALLET_WEBSITES[providerName]
  const lowercaseProviderName = providerName.toLowerCase()
  const logo = lowercaseProviderName && getLogo(lowercaseProviderName)
  const firstLetterCapitalizedProvider = `${providerName[0]}${lowercaseProviderName.slice(1)}`

  return (
    <div className={cx('installProvider')}>
      <button type="button" className={cx('closeButton')} onClick={() => closeModal()} />
      <img src={logo} alt="logo" style={logoStyle} />
      <h3 className={cx('installText')}>Install {providerName}</h3>
      <p className={cx('downloadText')}>
        {firstLetterCapitalizedProvider} is not currently installed or detected.{' '}
        <a className={cx('downloadLink')} href={downloadLink} target="_blank" rel="noopener noreferrer">
          Please download and install {firstLetterCapitalizedProvider}
        </a>{' '}
        to start using {name}.
      </p>
    </div>
  )
}

InstallProvider.propTypes = {
  closeModal: PropTypes.func.isRequired,
  providerName: PropTypes.string,
}

InstallProvider.defaultProps = {
  providerName: '',
}

export default InstallProvider
