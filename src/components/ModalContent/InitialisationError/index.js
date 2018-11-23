import React from 'react'
import { withNamespaces } from 'react-i18next'
import { capitalize } from 'lodash'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getLogo } from 'integrations/utils'
import style from './InitialisationError.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const InitialisationError = ({ closeModal, providerName, t }) => {
  const lowercaseProviderName = providerName.toLowerCase()
  const logo = lowercaseProviderName && getLogo(lowercaseProviderName)

  return (
    <div className={cx('initialisationError')}>
      <button className={cx('closeButton')} onClick={closeModal} type="button" />
      {logo && <img src={logo} alt="logo" style={logoStyle} />}
      <h3 className={cx('heading')}>
        {t('initialisation_error.heading', { provider: capitalize(providerName) })}
      </h3>
      <p className={cx('text')}>{t('initialisation_error.instructions')}</p>
    </div>
  )
}

InitialisationError.propTypes = {
  closeModal: PropTypes.func.isRequired,
  providerName: PropTypes.string,
  t: PropTypes.func.isRequired,
}

InitialisationError.defaultProps = {
  providerName: '',
}

export default withNamespaces()(InitialisationError)
