import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import MetamaskIcon from 'integrations/metamask/assets/metamask-logo.svg'
import css from './UnlockMetamask.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name } = getFeatureConfig('tournament')

const UnlockMetamask = ({ closeModal, t }) => (
  <div className={cx('unlockMetamask')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>{t('unlock.heading')}</h3>
    <p className={cx('text')}>
      {t('unlock.instructions', { applicationName: name || t('application') })}
    </p>
  </div>
)

UnlockMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(UnlockMetamask)
