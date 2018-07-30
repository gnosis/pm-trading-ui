import React, { Component } from 'react'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Decimal from 'decimal.js'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import { isMarketClosed, isMarketResolved } from 'store/utils/marketStatus'
import { LOWEST_VALUE } from 'utils/constants'
import { marketShape, ReactRouterMatchShape } from 'utils/shapes'
import ShareRow from './ShareRow'
import ShareSellView from './ShareSellView'
import style from './SharesTable.mod.scss'

const cx = cn.bind(style)

class SharesTable extends Component {
  @autobind
  async handleSellShare(shareId, shareAmount, earnings) {
    const {
      marketShares, market, changeUrl, sellShares,
    } = this.props
    const share = marketShares.find(marketShare => marketShare.id === shareId)
    const shareBalance = new Decimal(share.balance)
    const shareBalanceRounded = shareBalance.div(1e18).toDP(4, 1)
    const selectedSellAmount = new Decimal(shareAmount)
    const sellAmount = shareBalanceRounded.sub(selectedSellAmount).lt(LOWEST_VALUE)
      ? weiToEth(shareBalance)
      : shareAmount
    try {
      await sellShares(market, share, sellAmount, earnings)
      changeUrl(`/markets/${market.address}/my-shares`)
    } catch (e) {
      console.error(e)
    }
  }

  @autobind
  handleShowSellView(e, shareId) {
    const {
      match: {
        params: { shareId: currentShare },
      },
      market,
      changeUrl,
    } = this.props
    if (currentShare === shareId) {
      changeUrl(`/markets/${market.address}/my-shares`)
      return
    }
    changeUrl(`/markets/${market.address}/my-shares/${shareId}`)
  }

  generateTableRows() {
    const {
      marketShares,
      market,
      gasCosts,
      gasPrice,
      selectedSellAmount,
      match: {
        params: { shareId: extendedShareId },
      },
      isGasCostFetched,
      isGasPriceFetched,
    } = this.props
    const tableRows = []

    marketShares.map((share) => {
      const isExtended = extendedShareId === share.id
      const ableToSell = !isMarketClosed(market) && !isMarketResolved(market)
      const outcomeName = getOutcomeName(market, share.outcomeToken.index)

      tableRows.push(<ShareRow
        key={share.id}
        isExtended={isExtended}
        market={market}
        ableToSell={ableToSell}
        share={share}
        outcomeName={outcomeName}
        onSellClick={this.handleShowSellView}
      />)

      if (extendedShareId === share.id && ableToSell) {
        tableRows.push(<ShareSellView
          key={`${share.id}-sellView`}
          share={share}
          market={market}
          gasCosts={gasCosts}
          gasPrice={gasPrice}
          isGasCostFetched={isGasCostFetched}
          isGasPriceFetched={isGasPriceFetched}
          selectedSellAmount={selectedSellAmount}
          handleSellShare={this.handleSellShare}
        />)
      }
    })

    return tableRows
  }

  render() {
    return (
      <table className={cx('table', 'sharesTable')}>
        <thead>
          <tr>
            <th className={cx('sharesTableHeading', 'index')} />
            <th className={cx('sharesTableHeading', 'group')}>
              Outcome
            </th>
            <th className={cx('sharesTableHeading', 'group')}>
              Outcome Token Count
            </th>
            <th className={cx('sharesTableHeading', 'group')} />
          </tr>
        </thead>
        <tbody>
          {this.generateTableRows()}
        </tbody>
      </table>
    )
  }
}

SharesTable.propTypes = {
  market: marketShape,
  marketShares: ImmutablePropTypes.list,
  gasCosts: ImmutablePropTypes.map,
  gasPrice: PropTypes.instanceOf(Decimal),
  isGasCostFetched: PropTypes.func.isRequired,
  isGasPriceFetched: PropTypes.bool,
  selectedSellAmount: PropTypes.string,
  sellShares: PropTypes.func,
  match: ReactRouterMatchShape,
  changeUrl: PropTypes.func.isRequired,
}

SharesTable.defaultProps = {
  market: {},
  marketShares: List(),
  gasCosts: Map({}),
  gasPrice: Decimal(0),
  selectedSellAmount: undefined,
  sellShares: () => {},
  match: {},
  isGasPriceFetched: false,
}

export default SharesTable
