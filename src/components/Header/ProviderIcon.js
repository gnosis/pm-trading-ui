import React from 'react'
import className from 'classnames/bind'

import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import IconMetamask from 'assets/img/icons/icon_metamask.svg'
import IconParity from 'assets/img/icons/icon_parity.svg'
import IconEtherToken from 'assets/img/icons/icon_etherTokens.svg'

import css from './ProviderIcon.mod.scss'

const cx = className.bind(css)

const PROVIDER_METAMASK = 'METAMASK'
const PROVIDER_PARITY = 'PARITY'
const PROVIDER_REMOTE = 'REMOTE'

const PROVIDER_ICONS = {
  [PROVIDER_METAMASK]: IconMetamask,
  [PROVIDER_PARITY]: IconParity,
  [PROVIDER_REMOTE]: IconEtherToken,
}

const ProviderIcon = ({ provider }) => (
  <div
    className={cx('providerIcon')}
    style={{ backgroundImage: `url(${PROVIDER_ICONS[provider.name]})` }}
    title={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Gnosis`}
  />
)

ProviderIcon.propTypes = {
  provider: providerPropType,
}

ProviderIcon.defaultProps = {
  provider: {},
}

export default ProviderIcon
