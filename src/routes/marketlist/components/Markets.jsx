import { List } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames/bind'

import { isMarketClosed } from 'store/utils/marketStatus'

import Market from './Market/index.jsx'
import css from './Markets.mod.scss'

const cx = classNames.bind(css)

const Markets = ({ markets, userAccount }) => (
  <div className={cx('markets')}>
    <div className={cx('title')}>
      Showing {markets.size} of {markets.size}
    </div>
    <div>
      {markets.map((market) => {
        const closed = isMarketClosed(market.stage, market.resolution, market.resolved)
        const isOwner = !!(userAccount && market.creator === userAccount)

        return (
          <Market
            key={market.address}
            market={market}
            address={market.address}
            resolved={market.resolved}
            closed={closed}
            isOwner={isOwner}
            title={market.title}
            resolution={market.resolution}
            volume={market.volume}
            collateralToken={market.collateralToken}
          />
        )
      })}
    </div>
  </div>
)


Markets.propTypes = {
  markets: PropTypes.instanceOf(List),
  userAccount: PropTypes.string,
}

Markets.defaultProps = {
  markets: List([]),
  userAccount: undefined,
}

export default Markets
