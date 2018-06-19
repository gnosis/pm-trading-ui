import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Decimal from 'decimal.js'

import { marketShape } from 'utils/shapes'
import { GAS_COST } from 'utils/constants'
import SharesTable from './SharesTable'

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
        <div>
          <h2>
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
  marketShares: PropTypes.objectOf(PropTypes.object),
  sellShares: PropTypes.func.isRequired,
  fetchMarketShares: PropTypes.func.isRequired,
  requestGasCost: PropTypes.func.isRequired,
  requestGasPrice: PropTypes.func.isRequired,
  isGasCostFetched: PropTypes.func.isRequired,
  isGasPriceFetched: PropTypes.bool,
  gasCosts: ImmutablePropTypes.map,
  gasPrice: PropTypes.instanceOf(Decimal),
}

MarketMySharesForm.defaultProps = {
  defaultAccount: undefined,
  market: undefined,
  selectedSellAmount: undefined,
  limitMargin: '0',
  marketShares: {},
  isGasPriceFetched: false,
  gasCosts: undefined,
  gasPrice: undefined,
}

export default MarketMySharesForm
