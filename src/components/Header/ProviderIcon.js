import React from 'react'
import className from 'classnames/bind'
import Tooltip from 'rc-tooltip'

import Icon from 'components/Icon'

import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import css from './ProviderIcon.mod.scss'

const cx = className.bind(css)

const PROVIDER_METAMASK = 'METAMASK'
const PROVIDER_PARITY = 'PARITY'
const PROVIDER_REMOTE = 'REMOTE'

const PROVIDER_ICONS = {
  [PROVIDER_METAMASK]: 'metamask',
  [PROVIDER_PARITY]: 'parity',
  [PROVIDER_REMOTE]: 'etherTokens',
}

const ProviderIcon = ({ provider }) => (
  <Tooltip placement="left" overlay={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Gnosis`}>
    <Icon type={PROVIDER_ICONS[provider.name]} size={35} />
  </Tooltip>
)

ProviderIcon.propTypes = {
  provider: providerPropType,
}

ProviderIcon.defaultProps = {
  provider: {},
}

export default ProviderIcon
