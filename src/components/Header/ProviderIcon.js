import React from 'react'
import Tooltip from 'rc-tooltip'

import Icon from 'components/Icon'

import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

const PROVIDER_METAMASK = 'bitcoin'
const PROVIDER_PARITY = 'PARITY'
const PROVIDER_REMOTE = 'REMOTE'

const PROVIDER_ICONS = {
  [PROVIDER_METAMASK]: 'bitcoin',
  [PROVIDER_PARITY]: 'parity',
  [PROVIDER_REMOTE]: 'etherTokens',
}

const providerIconStyle = {
  marginLeft: 10,
}

const ProviderIcon = ({ provider }) => (
  <Tooltip placement="left" overlay={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Timbo`}>
    <Icon type={PROVIDER_ICONS[provider.name]} size={35} style={providerIconStyle} />
  </Tooltip>
)

ProviderIcon.propTypes = {
  provider: providerPropType,
}

ProviderIcon.defaultProps = {
  provider: {},
}

export default ProviderIcon
