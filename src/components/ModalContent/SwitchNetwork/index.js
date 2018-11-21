import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import cn from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import style from './SwitchNetwork.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name } = getFeatureConfig('tournament')

const SwitchNetwork = ({ closeModal, targetNetwork, t }) => (
  <div className={cx('switchNetwork')}>
    <button type="button" className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>{t('switch_network.heading', { targetNetwork })}</h3>
    <p className={cx('text')}>
      {t('switch_network.instructions', { targetNetwork, applicationName: name || t('application') })}
    </p>
  </div>
)

SwitchNetwork.propTypes = {
  closeModal: PropTypes.func.isRequired,
  targetNetwork: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(SwitchNetwork)
