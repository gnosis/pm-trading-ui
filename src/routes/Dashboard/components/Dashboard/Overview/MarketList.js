import React from 'react'
import classnames from 'classnames/bind'

import style from './MarketList.mod.scss'

const cx = classnames.bind(style)

const MarketList = ({ markets, title, component: RenderComponent }) => (
  <div className={cx('marketList')}>
    <div className={cx('title')}>{title}</div>
    <div className={cx('list')}>
      {markets.map(market => (
        <RenderComponent className={cx('market')} key={market.address} market={market} />
      ))}
    </div>
  </div>
)

export default MarketList
