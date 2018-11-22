import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getLogo } from 'integrations/utils'
import style from './InitialisationError.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const InitialisationError = ({ closeModal, providerName }) => {
  const lowercaseProviderName = providerName.toLowerCase()
  const logo = lowercaseProviderName && getLogo(lowercaseProviderName)
  const firstLetterCapitalizedProvider = `${providerName[0]}${lowercaseProviderName.slice(1)}`

  return (
    <div className={cx('initialisationError')}>
      <button className={cx('closeButton')} onClick={closeModal} type="button" />
      {logo && <img src={logo} alt="logo" style={logoStyle} />}
      <h3 className={cx('heading')}>
        Oops! There was an error initialising {firstLetterCapitalizedProvider || 'wallet provider'}.
      </h3>
      <p className={cx('text')}>Wop Wop</p>
    </div>
  )
}

InitialisationError.propTypes = {
  closeModal: PropTypes.func.isRequired,
  providerName: PropTypes.string,
}

InitialisationError.defaultProps = {
  providerName: '',
}

export default InitialisationError
