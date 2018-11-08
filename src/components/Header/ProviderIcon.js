import React from 'react'
import Tooltip from 'rc-tooltip'

import Icon from 'components/Icon'

import { providerPropType } from 'utils/shapes'
import { upperFirst } from 'lodash'

import { WALLET_PROVIDER } from 'integrations/constants'

const PROVIDER_ICONS = {
  ...WALLET_PROVIDER,
  [WALLET_PROVIDER.REMOTE]: 'etherTokens',
}

const providerIconStyle = {
  marginLeft: 10,
}

const ProviderIcon = ({ provider }) => (
  <Tooltip placement="left" overlay={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Gnosis`}>
    <Icon type={PROVIDER_ICONS[provider.name]?.toLowerCase()} size={35} style={providerIconStyle} />
  </Tooltip>
)

ProviderIcon.propTypes = {
  provider: providerPropType,
}

ProviderIcon.defaultProps = {
  provider: {},
}

export default ProviderIcon
