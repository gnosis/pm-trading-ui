import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

import { marketRecordListShape } from 'utils/shapes'
import Spinner from 'components/Spinner/Indefinite'
import { NoMarket } from './Market'

import style from './MarketList.mod.scss'

const cx = classnames.bind(style)

const ConditionalList = ({ markets, viewMarket, component: MarketComponent }) => {
  if (!markets) {
    return (
      <div className={cx('list', 'loading')}>
        <Spinner />
      </div>
    )
  }

  if (markets.isEmpty()) {
    return (
      <div className={cx('list', 'empty')}>
        <NoMarket />
      </div>
    )
  }

  return (
    <div className={cx('list')}>
      {markets.map(market => (
        <MarketComponent className={cx('market')} key={market.address} market={market} viewMarket={viewMarket} />
      ))}
    </div>
  )
}

ConditionalList.propTypes = {
  markets: marketRecordListShape,
  viewMarket: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
}

ConditionalList.defaultProps = {
  markets: undefined,
}

const MarketList = ({
  markets, title, viewMarket, component: MarketComponent,
}) => (
  <div className={cx('marketList')}>
    <div className={cx('title')}>{title}</div>
    <ConditionalList markets={markets} component={MarketComponent} viewMarket={viewMarket} />
  </div>
)

MarketList.propTypes = {
  title: PropTypes.string.isRequired,
  viewMarket: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  markets: marketRecordListShape,
}

MarketList.defaultProps = {
  markets: undefined,
}

export default MarketList
