import React, { Component } from 'react'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Decimal from 'decimal.js'
import { isMarketClosed, isMarketResolved, getOutcomeName, weiToEth } from 'utils/helpers'
import { OUTCOME_TYPES, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, MIN_CONSIDER_VALUE } from 'utils/constants'
import { marketShape, ReactRouterMatchShape } from 'utils/shapes'
import ShareRow from './ShareRow'
import ShareSellView from './ShareSellView'
import style from './SharesTable.mod.scss'

const cx = cn.bind(style)

class SharesTable extends Component {
  state = {
    extendedSellId: this.props.match.params.shareId,
  }

  @autobind
  async handleSellShare(shareId, shareAmount, earnings) {
    const share = this.props.marketShares[shareId]
    const shareBalance = new Decimal(share.balance)
    const shareBalanceRounded = shareBalance.div(1e18).toDP(4, 1)
    const selectedSellAmount = new Decimal(shareAmount)
    const sellAmount = shareBalanceRounded.sub(selectedSellAmount).lt(MIN_CONSIDER_VALUE)
      ? weiToEth(shareBalance)
      : shareAmount
    try {
      await this.props.sellShares(this.props.market, share, sellAmount, earnings)
      this.props.changeUrl(`/markets/${this.props.market.address}/my-shares`)
    } catch (e) {
      console.error(e)
    }
  }

  @autobind
  handleShowSellView(e, shareId) {
    if (this.props.match.params.shareId === shareId) {
      this.props.changeUrl(`/markets/${this.props.market.address}/my-shares`)
      return
    }
    this.props.changeUrl(`/markets/${this.props.market.address}/my-shares/${shareId}`)
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
    } = this.props
    const tableRows = []

    Object.keys(marketShares).forEach((shareId) => {
      const share = marketShares[shareId]
      const colorScheme = share.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[share.outcomeToken.index] }
      const isExtended = extendedShareId === share.id
      const ableToSell = !isMarketClosed(market) && !isMarketResolved(market)
      const outcomeName = getOutcomeName(market, share.outcomeToken.index)

      tableRows.push(<ShareRow
        key={share.id}
        isExtended={isExtended}
        market={market}
        outcomeColorStyle={outcomeColorStyle}
        ableToSell={ableToSell}
        share={share}
        outcomeName={outcomeName}
        onSellClick={this.handleShowSellView}
      />)

      if (extendedShareId === shareId && ableToSell) {
        tableRows.push(<ShareSellView
          key={`${share.id}-sellView`}
          share={share}
          market={market}
          gasCosts={gasCosts}
          gasPrice={gasPrice}
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
            <th className={cx('sharesTableHeading', 'group')}>Outcome</th>
            <th className={cx('sharesTableHeading', 'group')}>Outcome Token Count</th>
            <th className={cx('sharesTableHeading', 'group')} />
          </tr>
        </thead>
        <tbody>{this.generateTableRows()}</tbody>
      </table>
    )
  }
}

SharesTable.propTypes = {
  market: marketShape,
  marketShares: PropTypes.objectOf(PropTypes.object),
  gasCosts: ImmutablePropTypes.map,
  gasPrice: PropTypes.instanceOf(Decimal),
  selectedSellAmount: PropTypes.string,
  sellShares: PropTypes.func,
  match: ReactRouterMatchShape,
  changeUrl: PropTypes.func.isRequired,
}

SharesTable.defaultProps = {
  market: {},
  marketShares: [],
  gasCosts: Map({}),
  gasPrice: Decimal(0),
  selectedSellAmount: undefined,
  sellShares: () => {},
  match: {},
}

export default SharesTable
