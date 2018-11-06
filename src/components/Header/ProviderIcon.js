import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'
import { withNamespaces } from 'react-i18next'

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

const ProviderIcon = ({ provider, t }) => (
  <Tooltip placement="left" overlay={t('using_provider', { provider: upperFirst(provider.name.toLowerCase()) })}>
    <Icon type={PROVIDER_ICONS[provider.name]?.toLowerCase()} size={35} style={providerIconStyle} />
  </Tooltip>
)

ProviderIcon.propTypes = {
  provider: providerPropType,
  t: PropTypes.func.isRequired,
}

ProviderIcon.defaultProps = {
  provider: {},
}

export default withNamespaces()(ProviderIcon)
