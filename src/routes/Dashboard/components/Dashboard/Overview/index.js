import React from 'react'
import classname from 'classnames/bind'

import style from './Overview.mod.scss'

import MarketList from './MarketList'

const cx = classname.bind(style)

const Overview = ({ newestMarkets, closingSoonMarkets }) => (
  <div className={cx('dashboardOverview')}>
    <MarketList markets={newestMarkets} />
    <MarketList markets={closingSoonMarkets} />
  </div>
)

export default Overview

