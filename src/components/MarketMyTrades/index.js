import React, { Component } from 'react'
import Decimal from 'decimal.js'

// import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName, { collateralTokenToText } from 'components/CurrencyName'

class MarketMyTrades extends Component {

  componentWillMount() {
    const { market, defaultAccount } = this.props
    // Get participant trades
    const trades = this.props.fetchMarketParticipantTrades(market.address, defaultAccount)
    console.log('Trades: ', trades)
  }

  render() {
    const { marketShares, market } = this.props

    return (
      <div className="marketMyShares">
        <form>
          <h2 className="marketMyShares__heading">My Trades</h2>
          <table className="table marketMyShares__shareTable">
            <thead>
              <tr>
                <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
                <th className="marketMyShares__tableHeading">Order Type</th>
                <th className="marketMyShares__tableHeading">Outcome</th>
                <th className="marketMyShares__tableHeading">Outcome token count</th>
                <th className="marketMyShares__tableHeading">Avg. Price</th>
                <th className="marketMyShares__tableHeading">Date</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </form>
      </div>
    )
  }
}

export default MarketMyTrades
