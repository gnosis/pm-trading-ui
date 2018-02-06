import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { WALLET_PROVIDER } from 'integrations/constants'
import { upperFirst } from 'lodash'

const providerIconClasses = {
  [WALLET_PROVIDER.METAMASK]: 'metamask',
  [WALLET_PROVIDER.PARITY]: 'parity',
}

const ProviderIcon = ({ provider = {} }) => (
  <div
    className={cn([
      'headerIcon',
      `headerIcon--${providerIconClasses[provider.name] || 'default'}`,
    ])}
    title={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Gnosis`}
  />
)

ProviderIcon.propTypes = {
  provider: PropTypes.shape({}),
}

export default ProviderIcon
