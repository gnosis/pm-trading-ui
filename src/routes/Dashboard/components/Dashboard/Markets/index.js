import React from 'react'
import PropTypes from 'prop-types'
import { marketRecordListShape } from 'utils/shapes'
import classname from 'classnames/bind'
import { withNamespaces } from 'react-i18next'

import style from './Markets.scss'

import MarketCategory from './Category'
import { NewMarket, ClosingSoonMarket } from './Market'

const cx = classname.bind(style)

const Markets = ({
  newestMarkets, closingSoonMarkets, viewMarket, t,
}) => (
  <div className={cx('dashboardOverview')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <MarketCategory markets={newestMarkets} title={t('dashboard.new_markets')} component={NewMarket} viewMarket={viewMarket} />
        </div>
        <div className={cx('col-md-6')}>
          <MarketCategory markets={closingSoonMarkets} title={t('dashboard.closing_soon')} component={ClosingSoonMarket} viewMarket={viewMarket} />
        </div>
      </div>
    </div>
  </div>
)

Markets.propTypes = {
  viewMarket: PropTypes.func.isRequired,
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
  t: PropTypes.func.isRequired,
}

Markets.defaultProps = {
  newestMarkets: undefined,
  closingSoonMarkets: undefined,
}

export default withNamespaces()(Markets)
