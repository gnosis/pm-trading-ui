import React from 'react'
import classnames from 'classnames/bind'
import Tooltip from 'rc-tooltip'


import styles from './MandatoryHint.scss'

const cx = classnames.bind(styles)

const MandatoryHint = () => (
  <Tooltip overlay={(
    <span>
This field is required
    </span>
  )}
  >
    <span className={cx('mandatoryHint')}>
*
    </span>
  </Tooltip>
)

export default MandatoryHint
