import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Icon from 'components/Icon'
import { getProviderConfig } from 'utils/features'
import style from './SelectProvider.scss'

const cx = cn.bind(style)

const providers = getProviderConfig()

const providerWithLogos = providers.map(providerName => ({
  name: providerName,
  logo: require(`integrations/${providerName.toLowerCase()}/assets/${providerName.toLowerCase()}-logo.svg`),
}))

class SelectProvider extends Component {
  componentDidMount = () => {}

  render() {
    const { closeModal } = this.props
    const nextIconStyle = {
      width: 25,
      height: 25,
    }
    return (
      <div className={cx('selectProvider')}>
        <button className={cx('closeButton')} onClick={closeModal} type="button" />
        <div className={cx('providersContainer')}>
          <h3 className={cx('heading')}>How would you like to access your wallet?</h3>
          <div className={cx('providersList')}>
            {providerWithLogos.map(({ name, logo }, index) => (
              <div key={name} className={cx('provider')}>
                <img src={logo} className={cx('providerLogo')} alt="Logo" />
                <span className={cx('providerName')}>{name}</span>
                <Icon type="next" className={cx('nextIcon')} style={nextIconStyle} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

SelectProvider.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default SelectProvider
