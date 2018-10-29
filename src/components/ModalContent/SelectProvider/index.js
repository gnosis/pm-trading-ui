import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { getProviderConfig } from 'utils/features'
import style from './SelectProvider.scss'

const cx = cn.bind(style)

const providers = getProviderConfig()

const providerWithLogos = providers.map(providerName => ({
  name: providerName,
  logo: require(`integrations/${providerName.toLowerCase()}/assets/${providerName.toLowerCase()}-logo.svg`),
}))

class SelectProvider extends Component {
  static propTypes = {
    prop: PropTypes,
  }

  componentDidMount = () => {}

  render() {
    console.log(providerWithLogos)
    return (
      <div className={cx('selectProvider')}>
        <div className={cx('providersContainer')}>
          <h3 className={cx('heading')}>Select a provider</h3>
          <div className={cx('providersList')}>
            {providerWithLogos.map(({ name, logo }) => (
              <div className={cx('provider')}>
                <img key={name} src={logo} className={cx('providerLogo')} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectProvider
