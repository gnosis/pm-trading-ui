import React, { Component } from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { marketShape } from 'utils/shapes'
import { GAS_COST } from 'utils/constants'
import SharesTable from './SharesTable'
import style from './marketMySharesForm.mod.scss'

const cx = cn.bind(style)

export const MY_TOKENS = 'My Tokens'

class MarketMySharesForm extends Component {
  componentDidMount() {
    const {
      gasCosts, gasPrice, requestGasCost, requestGasPrice,
    } = this.props

    if (gasCosts.get('sellShares') === undefined) {
      requestGasCost(GAS_COST.SELL_SHARES)
    }
    if (gasPrice === undefined) {
      requestGasPrice()
    }

    if (this.props.defaultAccount) {
      this.props.fetchMarketShares(this.props.defaultAccount)
    }
  }

  render() {
    const { marketShares, market } = this.props
    if (!marketShares || !Object.keys(marketShares).length) {
      return (
        <div className="marketMyShares">
          <h2 className="marketMyShares__heading">
            You don&apos;t hold any shares for this market.
            <br />
            <small>It may take some time for the blockchain to mine your share purchase.</small>
          </h2>
        </div>
      )
    }

    return (
      <div>
        <h2>{MY_TOKENS}</h2>
        <SharesTable marketShares={marketShares} market={market} {...this.props} />
      </div>
    )
  }
}

MarketMySharesForm.propTypes = {
  defaultAccount: PropTypes.string,
  market: marketShape,
  selectedSellAmount: PropTypes.string,
  limitMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
  fetchMarketShares: PropTypes.func,
  requestGasCost: PropTypes.func,
  requestGasPrice: PropTypes.func,
}

export default MarketMySharesForm
