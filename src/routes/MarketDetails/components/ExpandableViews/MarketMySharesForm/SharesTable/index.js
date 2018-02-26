import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isMarketClosed, isMarketResolved } from 'utils/helpers'
import { OUTCOME_TYPES, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import ShareRow from './ShareRow'

class ShareTable extends Component {
  generateTableRows() {
    const { marketShares, extendedSellId, market } = this.props
    const tableRows = []
    Object.keys(marketShares).forEach((shareId) => {
      const share = marketShares[shareId]
      const colorScheme = share.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[share.outcomeToken.index] }
      const isExtended = extendedSellId === share.id
      const ableToSell = !isMarketClosed(market) && !isMarketResolved(market)

      tableRows.push(<ShareRow
        isExtended={isExtended}
        market={market}
        outcomeColorStyle={outcomeColorStyle}
        ableToSell={ableToSell}
        share={share}
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
  extendedSellId: PropTypes.string,
  market: marketShape,
  marketShares: PropTypes.arrayOf(PropTypes.object),
}

export default ShareTable
