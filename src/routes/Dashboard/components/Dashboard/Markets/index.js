import React from 'react'
import PropTypes from 'prop-types'
import { marketRecordListShape } from 'utils/shapes'
import classname from 'classnames/bind'

import style from './Markets.mod.scss'

import MarketCategory from './Category'
import { NewMarket, ClosingSoonMarket } from './Market'

const cx = classname.bind(style)

const Markets = ({ newestMarkets, closingSoonMarkets, viewMarket }) => (
  <div className={cx('dashboardOverview')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <MarketCategory markets={newestMarkets} title="Newest Markets" component={NewMarket} viewMarket={viewMarket} />
        </div>
        <div className={cx('col-md-6')}>
          <MarketCategory markets={closingSoonMarkets} title="Closing Soon" component={ClosingSoonMarket} viewMarket={viewMarket} />
        </div>
      </div>
    </div>
  </div>
)

Markets.propTypes = {
  viewMarket: PropTypes.func.isRequired,
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
}

Markets.defaultProps = {
  newestMarkets: undefined,
  closingSoonMarkets: undefined,
}

export default Markets

