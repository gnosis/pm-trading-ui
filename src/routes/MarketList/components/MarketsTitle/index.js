import React from 'react'
import classNames from 'classnames/bind'

import css from './MarketsTitle.scss'

const cx = classNames.bind(css)

const MarketListTitle = () => (
  <div className={cx('marketListTitle')}>
    <div className="container">
      <h1>Market overview</h1>
    </div>
  </div>
)

export default MarketListTitle
