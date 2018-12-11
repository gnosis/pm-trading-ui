import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import classnames from 'classnames/bind'
import Tooltip from 'rc-tooltip'

import styles from './WrongNetwork.scss'

const cx = classnames.bind(styles)

const wrongNetworkIconStyle = {
  width: 20,
  height: 20,
}

const WrongNetwork = ({ targetNetwork }) => (
  <Tooltip
    placement="bottom"
    overlay={<span>You&apos;re connected to the wrong network. Please connect to the {targetNetwork} network.</span>}
  >
    <Icon type="attention" className={cx('wrongNetwork')} style={wrongNetworkIconStyle} />
  </Tooltip>
)

WrongNetwork.propTypes = {
  targetNetwork: PropTypes.string.isRequired,
}

export default WrongNetwork
