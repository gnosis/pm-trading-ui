import React, { Component, Fragment } from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import moment from 'moment'
import { Map } from 'immutable'
import CurrencyName from 'components/CurrencyName'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  RESOLUTION_TIME, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, OUTCOME_TYPES,
} from 'utils/constants'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import TableHeader from './TableHeader'
import TradeRow from './TradeRow'

import style from './marketMyTrades.mod.scss'

const cx = cn.bind(style)

class MarketMyTrades extends Component {
  static propTypes = {
    market: ImmutablePropTypes.record.isRequired,
    marketTrades: ImmutablePropTypes.map,
    defaultAccount: PropTypes.string.isRequired,
    fetchMarketTradesForAccount: PropTypes.func,
  }

  static defaultProps = {
    marketTrades: Map(),
    fetchMarketTradesForAccount: () => {},
  }

  componentDidMount() {
    const { marketTrades, defaultAccount, fetchMarketTradesForAccount } = this.props
    if (!marketTrades || marketTrades.isEmpty() || !defaultAccount) {
      fetchMarketTradesForAccount(defaultAccount)
    }
  }

  renderTrades() {
    const {
      market,
      marketTrades,
      market: { type },
    } = this.props
    const colorScheme = type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT

    const tableRowElements = marketTrades.map((trade) => {
      const outcomeColorStyle = { backgroundColor: colorScheme[trade.outcomeToken.index] }
      const tradeDate = moment
        .utc(trade.date)
        .local()
        .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
      const outcomeName = getOutcomeName(market, trade.outcomeToken.index)

      let tradeCost = '0'
      if (trade.price !== 'None') {
        tradeCost = (
          <Fragment>
            {Decimal(weiToEth(trade.price))
              .toDP(2, 1)
              .toString()}
            &nbsp;
            <CurrencyName tokenAddress={market.collateralToken} />
          </Fragment>
        )
      }

      return (
        <TradeRow
          key={trade.id}
          trade={trade}
          tradeCost={tradeCost}
          outcomeColorStyle={outcomeColorStyle}
          tradeDate={tradeDate}
          outcomeName={outcomeName}
          collateralToken={market.collateralToken}
        />
      )
    })

    return tableRowElements
  }

  render() {
    const { marketTrades } = this.props
    if (marketTrades && !marketTrades.isEmpty()) {
      return (
        <div className={cx('marketMyTrades')}>
          <h2>My Trades</h2>
          <table className={cx('shareTable', 'table')}>
            <TableHeader />
            <tbody>{this.renderTrades()}</tbody>
          </table>
        </div>
      )
    }

    return (
      <div className={cx('marketMyTrades')}>
        <h2>
          You haven&apos;t interacted with this market yet.
          <br />
          <small>Every transaction that happens on this market will be shown here.</small>
        </h2>
      </div>
    )
  }
}

export default MarketMyTrades
