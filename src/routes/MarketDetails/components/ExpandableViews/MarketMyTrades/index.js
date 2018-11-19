import React, { Component, Fragment } from 'react'
import cn from 'classnames/bind'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import moment from 'moment'
import { List } from 'immutable'
import CurrencyName from 'components/CurrencyName'
import ImmutablePropTypes from 'react-immutable-proptypes'

import {
  RESOLUTION_TIME, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, OUTCOME_TYPES,
} from 'utils/constants'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import TableHeader from './TableHeader'
import TradeRow from './TradeRow'

import style from './marketMyTrades.scss'

const cx = cn.bind(style)

class MarketMyTrades extends Component {
  static propTypes = {
    market: ImmutablePropTypes.record.isRequired,
    marketTrades: ImmutablePropTypes.list,
    defaultAccount: PropTypes.string.isRequired,
    fetchMarketTradesForAccount: PropTypes.func,
  }

  static defaultProps = {
    marketTrades: List(),
    fetchMarketTradesForAccount: () => {},
  }

  componentDidMount() {
    const { defaultAccount, fetchMarketTradesForAccount } = this.props
    if (defaultAccount) {
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
    const { marketTrades, t } = this.props
    if (marketTrades && !marketTrades.isEmpty()) {
      return (
        <div className={cx('marketMyTrades')}>
          <h2>{t('market.my_trades')}</h2>
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
          {t('market.no_trades')}
          <br />
          <small>
            {t('market.no_trades_hint')}
          </small>
        </h2>
      </div>
    )
  }
}

MarketMyTrades.propTypes = {
  marketTrades: PropTypes.any,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(MarketMyTrades)
