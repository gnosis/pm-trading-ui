import React, { PropTypes } from 'react'
import cn from 'classnames'

import { WALLET_PROVIDER } from 'integrations/constants'

const providerIconClasses = {
  [WALLET_PROVIDER.METAMASK]: 'metamask',
  [WALLET_PROVIDER.PARITY]: 'parity',
}

const ProviderIcon = ({ provider = {} }) => (
  <div
    className={cn([
      'headerIcon',
      `headerIcon--${providerIconClasses[provider.name] || 'default'}`,
      'pull-left',
    ])}
  />
)

ProviderIcon.propTypes = {
  provider: PropTypes.shape({}),
}

export default ProviderIcon
