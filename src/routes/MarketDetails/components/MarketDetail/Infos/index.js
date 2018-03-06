import React from 'react'
import Decimal from 'decimal.js'
import { collateralTokenToText } from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'
import { weiToEth } from 'utils/helpers'

const Infos = ({ market, defaultAccount, moderators }) => {
  const marketInfos = {
    Token: collateralTokenToText(market.event.collateralToken),
    Fee: `${decimalToText(market.fee, 2) / 10000} %`,
    Funding: `${decimalToText(Decimal(market.funding).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
    'Trading Volume': `${decimalToText(Decimal(market.tradingVolume).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
  }
  const showWithdrawFees =
    defaultAccount &&
    market.oracle.owner === defaultAccount &&
    new Decimal(market.collectedFees).gt(0)

  if (moderators[defaultAccount]) {
    // Show creator String
    marketInfos.creator = moderators[market.creator] || market.creator
  }

  if (showWithdrawFees) {
    marketInfos['Earnings through market fees'] = `${decimalToText(weiToEth(market.collectedFees))} ${collateralTokenToText(market.event.collateralToken)}`
  }

  return (
    <div className="marketInfos col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0">
      {Object.keys(marketInfos).map(label => (
        <div className="marketInfo" key={label}>
          <p className="marketInfo__info marketInfo__info--value">{marketInfos[label]}</p>
          <p className="marketInfo__info marketInfo__info--label">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default Infos
