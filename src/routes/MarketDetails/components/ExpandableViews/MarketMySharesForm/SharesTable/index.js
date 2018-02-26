import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'
import { reduxForm, propTypes } from 'redux-form'
import { isMarketClosed, isMarketResolved, getOutcomeName, weiToEth } from 'utils/helpers'
import { LIMIT_MARGIN_DEFAULT, OUTCOME_TYPES, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, MIN_CONSIDER_VALUE } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import ShareRow from './ShareRow'

class ShareTable extends Component {
  state = {
    extendedSellId: this.props.match.params.shareId,
  }

  componentDidUpdate() {
    const { extendedSellId } = this.state
    const { selectedSellAmount, marketShares, initialize } = this.props
    const sellAmountAndMarketSharesAreDefined =
      selectedSellAmount === undefined && extendedSellId !== undefined && Object.keys(marketShares).length

    if (sellAmountAndMarketSharesAreDefined) {
      // By default form is filled up with fill amount
      const share = marketShares[extendedSellId]

      if (share) {
        const fullAmount = Decimal(share.balance)
          .div(1e18)
          .toDP(4, 1)
          .toString()
        initialize({ sellAmount: fullAmount })
      }
    }
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
    return this.props.reset()
  }

  @autobind
  handleShowSellView(e, shareId) {
    const { initialize } = this.props
    const { extendedSellId } = this.state
    e.preventDefault()
    this.props.reset()
    // Form reset / reinitialization when switching among shares
    initialize({
      limitMargin: LIMIT_MARGIN_DEFAULT,
    })
    this.setState({ extendedSellId: extendedSellId === shareId ? undefined : shareId })
  }

  generateTableRows() {
    const { marketShares, market } = this.props
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
      />)
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
  ...propTypes,
  extendedSellId: PropTypes.string,
  market: marketShape,
  marketShares: PropTypes.arrayOf(PropTypes.object),
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(ShareTable)
