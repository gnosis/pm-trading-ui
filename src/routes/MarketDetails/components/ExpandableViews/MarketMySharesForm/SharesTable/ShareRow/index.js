import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import OutcomeColorBox from 'components/OutcomeColorBox'
import { LOWEST_DISPLAYED_VALUE } from 'utils/constants'
import { getOutcomeName } from 'utils/helpers'

class ShareRow extends Component {
  render() {
    const {
      outcomeColorStyle, ableToSell, market, share,
    } = this.props
    return (
      <tr className="marketMyShares__share">
        <td>
          <OutcomeColorBox style={outcomeColorStyle} />
        </td>
        <td className="">{getOutcomeName(market, share.outcomeToken.index)}</td>
        <td>
          {Decimal(share.balance)
            .div(1e18)
            .gte(LOWEST_DISPLAYED_VALUE) ? (
              <DecimalValue value={Decimal(share.balance).div(1e18)} />
            ) : (
              `< ${LOWEST_DISPLAYED_VALUE}`
            )}
        </td>
        <td>
          {ableToSell && (
            <button
              className="marketMyShares__sellButton"
              onClick={e => this.handleShowSellView(e, share.id)}
            >
              Sell
            </button>
          )}
        </td>
      </tr>
    )
  }
}

ShareRow.propTypes = {
  outcomeColorStyle: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
  }),
  ableToSell: PropTypes.bool,
}

ShareRow.defaultProps = {
  outcomeColorStyle: {
    backgroundColor: '#fff',
  },
  ableToSell: false,
}

export default ShareRow
