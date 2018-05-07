import React from 'react'
import classname from 'classnames/bind'

import style from './Market.mod.scss'

const cx = classname.bind(style)

const NoMarket = () => (
  <div className={cx('market', 'none')}>
    <div className={cx('title')}>No Markets yet</div>
  </div>
)

export default NoMarket

