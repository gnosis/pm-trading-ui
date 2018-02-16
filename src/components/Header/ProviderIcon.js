import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames'

import { providerPropType } from 'utils/shapes'
import { WALLET_PROVIDER } from 'integrations/constants'
import { upperFirst } from 'lodash'

import styles from './ProviderIcon.scss'

const cx = className.bind(styles)

const providerIconClasses = {
  [WALLET_PROVIDER.METAMASK]: 'metamask',
  [WALLET_PROVIDER.PARITY]: 'parity',
}

const ProviderIcon = ({ provider }) => (
  <div
    className={cx([
      'headerIcon',
      `headerIcon--${providerIconClasses[provider.name] || 'default'}`,
    ])}
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
