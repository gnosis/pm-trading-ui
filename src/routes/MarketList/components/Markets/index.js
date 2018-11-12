import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { withNamespaces } from 'react-i18next'
import { List } from 'immutable'

import { isMarketClosedOrResolved } from 'store/utils/marketStatus'

import Market from './Market'
import css from './Markets.scss'

const cx = classNames.bind(css)

const Markets = ({
  markets, userAccount, viewMarket, t,
}) => (
  <div className={cx('markets')}>
    <div className={cx('title')}>
      {t('markets.limit_description', { total: markets.size, current: markets.size })}
    </div>
    <div>
      {markets.map((market) => {
        const closedOrResolved = isMarketClosedOrResolved(market)
        const isOwner = !!(userAccount && market.creator === userAccount)

        return (
          <Market
            key={market.address}
            market={market}
            address={market.address}
            resolved={market.resolved}
            closed={closedOrResolved}
            isOwner={isOwner}
            title={market.title}
            resolution={market.resolution}
            volume={market.volume}
            collateralToken={market.collateralToken}
            viewMarket={viewMarket}
          />
        )
      })}
    </div>
  </div>
)


Markets.propTypes = {
  viewMarket: PropTypes.func.isRequired,
  markets: PropTypes.instanceOf(List),
  userAccount: PropTypes.string,
  t: PropTypes.func.isRequired,
}

Markets.defaultProps = {
  markets: List([]),
  userAccount: undefined,
}

export default withNamespaces()(Markets)
