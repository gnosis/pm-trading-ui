import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import ImmutableProptypes from 'react-immutable-proptypes'
import Markdown from 'react-markdown'
import moment from 'moment'
import Decimal from 'decimal.js'
import { LOWEST_VALUE } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import Outcome from 'components/Outcome'
import MarketTimer from './MarketTimer'
import RedeemWinnigs from './RedeemWinnings'
import style from './Details.scss'

const cx = cn.bind(style)

const ONE_WEEK_IN_HOURS = 168

const Details = ({
  market, marketShares, gasCosts, gasPrice, handleRedeemWinnings, hasWallet,
}) => {
  const timeToResolution = moment
    .utc(market.resolution)
    .local()
    .diff(moment(), 'hours')
  const winningsTotal = marketShares.reduce(
    (winnings, share) => winnings.add(Decimal(share.winnings || '0')),
    Decimal(0),
  )
  const redeemWinningsGasCost = gasCosts.get('redeemWinnings')
  const marketClosed = market.closed
  const marketResolved = market.resolved
  const showWinning = marketResolved && winningsTotal.gt(LOWEST_VALUE) && hasWallet
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

  /* eslint-disable */
  const markdownRenderers = {
    link: props => (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    ),
  }
  /* eslint-enable */
  const marketOutcomes = market.outcomes ? market.outcomes.map(outcome => outcome.name).toArray() : []

  return (
    <div className={cx('col-xs-10 col-xs-offset-1 col-sm-9 col-sm-offset-0')}>
      <Markdown className={cx('marketDescription')} source={market.description} renderers={markdownRenderers} />
      <Outcome
        resolved={marketResolved}
        type={market.type}
        outcomeTokensSold={market.outcomeTokensSold.toArray()}
        resolution={market.resolution}
        funding={market.funding}
        outcomes={marketOutcomes}
        winningOutcome={market.winningOutcome}
        upperBound={market.bounds?.upper}
        lowerBound={market.bounds?.lower}
        decimals={market.bounds?.decimals}
        unit={market.bounds?.unit}
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
          collateralToken={market.collateralToken}
        />
      )}
    </div>
  )
}

Details.propTypes = {
  market: marketShape.isRequired,
  marketShares: ImmutableProptypes.list,
  handleRedeemWinnings: PropTypes.func,
  gasCosts: ImmutableProptypes.map.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal).isRequired,
  hasWallet: PropTypes.bool.isRequired,
}

Details.defaultProps = {
  handleRedeemWinnings: () => {},
  marketShares: {},
}

export default Details
