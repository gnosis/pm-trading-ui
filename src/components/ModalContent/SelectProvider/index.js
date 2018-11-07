import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Icon from 'components/Icon'
import { WALLET_STATUS } from 'integrations/constants'
import style from './SelectProvider.scss'

const cx = cn.bind(style)

const nextIconStyle = {
  width: 25,
  height: 25,
}

// eslint-disable-next-line
const getLogo = providerName => require(`integrations/${providerName}/assets/${providerName}-logo.svg`)

const renderProvidersList = providers => providers.map(({ name, logo }) => (
  <div key={name} className={cx('provider')}>
    <img src={logo} className={cx('providerLogo')} alt="Logo" />
    <span className={cx('providerName')}>{name}</span>
    <Icon type="link" className={cx('linkIcon')} style={nextIconStyle} />
    <Icon type="next" className={cx('nextIcon')} style={nextIconStyle} />
  </div>
))

class SelectProvider extends Component {
  componentDidMount = () => {}

  render() {
    const { closeModal, providersList } = this.props
    const providersObject = providersList.toJS()
    const providersWithLogos = Object.keys(providersObject).map(key => ({
      name: key,
      ...providersObject[key],
      logo: getLogo(key.toLowerCase()),
    }))

    const availableProviders = providersWithLogos.filter(({ status }) => status === WALLET_STATUS.READY_TO_INIT)
    const unavailableProviders = providersWithLogos.filter(
      ({ status }) => status === WALLET_STATUS.NOT_INSTALLED || status === WALLET_STATUS.ERROR,
    )

    return (
      <div className={cx('selectProvider')}>
        <button className={cx('closeButton')} onClick={closeModal} type="button" />
        <div className={cx('providersContainer')}>
          <h3 className={cx('heading')}>How would you like to access your wallet?</h3>
          <div className={cx('providersList')}>{renderProvidersList(providersWithLogos)}</div>
        </div>
      </div>
    )
  }
}

SelectProvider.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default SelectProvider
