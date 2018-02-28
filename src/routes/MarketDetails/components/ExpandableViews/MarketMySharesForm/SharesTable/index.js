import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import { isMarketClosed, isMarketResolved, getOutcomeName, weiToEth } from 'utils/helpers'
import {
  OUTCOME_TYPES,
  COLOR_SCHEME_SCALAR,
  COLOR_SCHEME_DEFAULT,
  MIN_CONSIDER_VALUE,
  LIMIT_MARGIN_DEFAULT,
} from 'utils/constants'
import { marketShape } from 'utils/shapes'
import ShareRow from './ShareRow'
import ShareSellView from './ShareSellView'

class ShareTable extends Component {
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
      this.setState({ extendedSellId: undefined })
    } catch (e) {
      console.error(e)
    }
  }

  @autobind
  handleShowSellView(e, shareId) {
    const { extendedSellId } = this.state
    this.setState({ extendedSellId: extendedSellId === shareId ? undefined : shareId })
  }

  generateTableRows() {
    const {
      marketShares, market, gasCosts, gasPrice, selectedSellAmount,
    } = this.props
    const { extendedSellId } = this.state
    const tableRows = []

    Object.keys(marketShares).forEach((shareId) => {
      const share = marketShares[shareId]
      const colorScheme = share.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[share.outcomeToken.index] }
      const isExtended = extendedSellId === share.id
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

      if (extendedSellId === shareId && ableToSell) {
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
      <table className="table marketMyShares__shareTable">
        <thead>
          <tr>
            <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
            <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome</th>
            <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome Token Count</th>
            <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group" />
          </tr>
        </thead>
        <tbody>{this.generateTableRows()}</tbody>
      </table>
    )
  }
}

ShareTable.propTypes = {
  market: marketShape,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  gasCosts: PropTypes.object,
  gasPrice: PropTypes.instanceOf(Decimal),
  selectedSellAmount: PropTypes.string,
  sellShares: PropTypes.func,
}

ShareTable.defaultProps = {
  market: undefined,
  marketShares: [],
  gasCosts: undefined,
  gasPrice: Decimal(0),
  selectedSellAmount: undefined,
  sellShares: () => {},
}

export default ShareTable
