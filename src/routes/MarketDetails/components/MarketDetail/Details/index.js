import React from 'react'
import moment from 'moment'
import Decimal from 'decimal.js'
import { MIN_CONSIDER_VALUE } from 'utils/constants'
import { isMarketClosed, isMarketResolved } from 'utils/helpers'
import Outcome from 'components/Outcome'
import MarketTimer from './MarketTimer'
import RedeemWinnigs from './RedeemWinnings'

const ONE_WEEK_IN_HOURS = 168

const Details = ({
  market, marketShares, gasCosts, gasPrice, handleRedeemWinnings,
}) => {
  const timeToResolution = moment
    .utc(market.eventDescription.resolutionDate)
    .local()
    .diff(moment(), 'hours')
  const winningsTotal = Object.keys(marketShares).reduce(
    (acc, shareId) => acc.add(Decimal(marketShares[shareId].winnings || '0')),
    Decimal(0),
  )
  const redeemWinningsGasCost = gasCosts.get('redeemWinnings')
  const marketClosed = isMarketClosed(market)
  const marketResolved = isMarketResolved(market)
  const showWinning = marketResolved && winningsTotal.gt(MIN_CONSIDER_VALUE)
  const marketClosedOrFinished = marketClosed || marketResolved
  const marketStatus = marketResolved ? 'resolved.' : 'closed.'
  const showCountdown = !marketClosedOrFinished && timeToResolution < ONE_WEEK_IN_HOURS
  const redeemWinningsTransactionGas = gasPrice
    .mul(redeemWinningsGasCost || 0)
    .div(1e18)
    .toDP(5, 1)
    .toString()

  return (
    <div className="marketDetails col-xs-10 col-xs-offset-1 col-sm-9 col-sm-offset-0">
      <div className="marketDescription">
        <p className="marketDescription__text">{market.eventDescription.description}</p>
      </div>
      <Outcome market={market} />
      <MarketTimer
        market={market}
        showCountdown={showCountdown}
        marketStatus={marketStatus}
        showStatus={marketClosedOrFinished}
      />
      {showWinning && (
        <RedeemWinnigs
          winningsAmount={winningsTotal}
          handleRedeemWinnigs={handleRedeemWinnings}
          transactionGas={redeemWinningsTransactionGas}
          collateralToken={market.event.collateralToken}
        />
      )}
    </div>
  )
}

export default Details
