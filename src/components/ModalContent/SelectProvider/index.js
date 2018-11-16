import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import Icon from 'components/Icon'
import { WALLET_STATUS, ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import { getLogo } from 'integrations/utils'
import style from './SelectProvider.scss'

const cx = cn.bind(style)

const nextIconStyle = {
  width: 25,
  height: 25,
}

class SelectProvider extends Component {
  componentDidMount = () => {
    const { requestTargetNetworkId } = this.props

    requestTargetNetworkId()
  }

  handleInit = (provider) => {
    const { initProviders, openModal } = this.props

    if (provider.status === WALLET_STATUS.NOT_INSTALLED) {
      openModal('ModalInstallProvider', { provider: provider.name })
      return
    }

    try {
      initProviders(provider.name)
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { closeModal, providersList, targetNetworkId } = this.props
    const providersObject = providersList.toJS()
    const providersWithLogos = Object.keys(providersObject).map(key => ({
      name: key,
      ...providersObject[key],
      logo: getLogo(key.toLowerCase()),
    }))
    const targetNetwork = ETHEREUM_NETWORK_IDS[targetNetworkId]

    return (
      <div className={cx('selectProvider')}>
        <button className={cx('closeButton')} onClick={closeModal} type="button" />
        <div className={cx('providersContainer')}>
          <h3 className={cx('heading')}>How would you like to access your wallet?</h3>
          {targetNetwork && (
            <span className={cx('annotation')}>Make sure your wallet is connected to the {targetNetwork} network.</span>
          )}
          <div className={cx('providersList')}>
            {providersWithLogos.map((provider) => {
              const { name, logo } = provider
              const handleClick = () => this.handleInit(provider)

              return (
                <button type="button" key={name} className={cx('provider')} onClick={handleClick}>
                  <img src={logo} className={cx('providerLogo')} alt="Logo" />
                  <span className={cx('providerName')}>{name}</span>
                  <Icon type="next" className={cx('nextIcon')} style={nextIconStyle} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

SelectProvider.propTypes = {
  closeModal: PropTypes.func.isRequired,
  initProviders: PropTypes.func.isRequired,
  providersList: ImmutablePropTypes.map.isRequired,
  openModal: PropTypes.func.isRequired,
  requestTargetNetworkId: PropTypes.func.isRequired,
  targetNetworkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

SelectProvider.defaultProps = {
  targetNetworkId: undefined,
}

export default SelectProvider
