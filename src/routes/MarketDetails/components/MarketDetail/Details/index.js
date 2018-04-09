import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import ImmutableProptypes from 'react-immutable-proptypes'
import moment from 'moment'
import Decimal from 'decimal.js'
import { MIN_CONSIDER_VALUE } from 'utils/constants'
import { marketShape, marketShareShape } from 'utils/shapes'
import { isMarketClosed, isMarketResolved } from 'utils/helpers'
import Outcome from 'components/Outcome'
import MarketTimer from './MarketTimer'
import RedeemWinnigs from './RedeemWinnings'
import style from './Details.mod.scss'

const cx = cn.bind(style)

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
  const outcomeOpts = {
    className: cx('outcomes'),
  }

  return (
    <div className={cx('col-xs-10 col-xs-offset-1 col-sm-9 col-sm-offset-0')}>
      <div className={cx('marketDescription')}>
        <p className={cx('text')}>{market.eventDescription.description}</p>
      </div>
      <Outcome
        resolved={marketResolved}
        type={market.event.type}
        outcomeTokensSold={market.netOutcomeTokensSold}
        resolution={market.eventDescription.resolutionDate}
        funding={market.funding}
        outcomes={market.eventDescription.outcomes}
        winningOutcome={market.oracle.winningOutcome}
        upperBound={market.event.upperBound}
        lowerBound={market.event.lowerBound}
        decimals={market.eventDescription.decimals}
        unit={market.eventDescription.unit}
        opts={outcomeOpts}
      />
      <MarketTimer
        market={market}
        showCountdown={showCountdown}
        marketStatus={marketStatus}
        showStatus={marketClosedOrFinished}
      />
      {showWinning && (
        <RedeemWinnigs
          winningsAmount={winningsTotal}
          handleRedeemWinnings={handleRedeemWinnings}
          transactionGas={redeemWinningsTransactionGas}
          collateralToken={market.event.collateralToken}
        />
      )}
    </div>
  )
}

Details.propTypes = {
  market: marketShape.isRequired,
  marketShares: PropTypes.objectOf(marketShareShape),
  handleRedeemWinnings: PropTypes.func,
  gasCosts: ImmutableProptypes.map.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal).isRequired,
}

Details.defaultProps = {
  handleRedeemWinnings: () => {},
  marketShares: {},
}

export default Details
