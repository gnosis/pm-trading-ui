import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import Tooltip from 'rc-tooltip'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import { WALLET_PROVIDER } from 'integrations/constants'
import { upperFirst } from 'lodash'
import selector from './selector'

const providerIconClasses = {
  [WALLET_PROVIDER.METAMASK]: 'metamask',
  [WALLET_PROVIDER.PARITY]: 'parity',
  [WALLET_PROVIDER.UPORT]: 'uport',
}

const uportBadgeStyle = {
  objectFit: 'contain',
  marginRight: '7px',
}

const ProviderIcon = ({ provider = {}, badge }) => {
  const isUport = provider && provider.name === 'UPORT'

  return (
    <Block>
      {isUport ? (
        <Tooltip placement="bottom" overlay={badge.name}>
          <Img style={uportBadgeStyle} src={badge.icon} width={40} height={38} />
        </Tooltip>
      ) : (
        <div
          className={cn(['headerIcon', `headerIcon--${providerIconClasses[name] || 'default'}`])}
          title={`You are using ${upperFirst(provider.name.toLowerCase())} to connect to Gnosis`}
        />
      )}
    </Block>
  )
}

ProviderIcon.propTypes = {
  provider: PropTypes.shape({}),
  badge: PropTypes.objectOf(PropTypes.string),
}

export default connect(selector)(ProviderIcon)
