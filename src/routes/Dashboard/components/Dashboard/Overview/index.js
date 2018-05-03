import React from 'react'
import { marketRecordListShape } from 'utils/shapes'
import classname from 'classnames/bind'

import style from './Overview.mod.scss'

import MarketList from './MarketList'
import { NewMarket, ClosingSoonMarket } from './Market'

const cx = classname.bind(style)

const Overview = ({ newestMarkets, closingSoonMarkets }) => (
  <div className={cx('dashboardOverview')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <MarketList markets={newestMarkets} title="Newest Markets" component={NewMarket} />
        </div>
        <div className={cx('col-md-6')}>
          <MarketList markets={closingSoonMarkets} title="Closing Soon" component={ClosingSoonMarket} />
        </div>
      </div>
    </div>
  </div>
)

Overview.propTypes = {
  newestMarkets: marketRecordListShape.isRequired,
  closingSoonMarkets: marketRecordListShape.isRequired,
}

export default Overview

