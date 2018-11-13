import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import style from './SelectProvider.scss'

const cx = cn.bind(style)

// eslint-disable-next-line
const getLogo = providerName => require(`integrations/${providerName}/assets/${providerName}-logo.svg`)

const logoStyle = {
  width: 100,
  height: 100,
}

const InitialisationError = ({ closeModal, providerName }) => {
  const logo = getLogo(providerName)
  return (
    <div className={cx('unlockMetamask')}>
      <button className={cx('closeButton')} onClick={closeModal} type="button" />
      {logo && <img src={logo} alt="logo" style={logoStyle} />}
      <h3 className={cx('heading')}>Oops! There was an error</h3>
      <p className={cx('text')}>
        Please unlock your MetaMask wallet to start using {tournamentConfig.name || 'the application'}.
      </p>
    </div>
  )
}

InitialisationError.propTypes = {
  closeModal: PropTypes.func.isRequired,
  initProviders: PropTypes.func.isRequired,
  providersList: ImmutablePropTypes.map.isRequired,
}

export default InitialisationError
