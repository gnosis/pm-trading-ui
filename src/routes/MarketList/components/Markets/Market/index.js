import { Record } from 'immutable'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { decimalToText } from 'components/DecimalValue'
import Outcome from 'components/Outcome'
import autobind from 'autobind-decorator'

import Decimal from 'decimal.js'
import moment from 'moment'
import React from 'react'
import { RESOLUTION_TIME } from 'utils/constants'
import MarketResolution from './MarketResolution'
import MarketStatus from './MarketStatus'
import MarketTrading from './MarketTrading'

import css from './Market.scss'

const cx = classNames.bind(css)

class Market extends React.PureComponent {
  @autobind
  handleViewMarket() {
    const { viewMarket, address } = this.props

    viewMarket(address)
  }

  render() {
    const { market } = this.props
    const {
      resolved,
      closed,
      title,
      resolution,
      volume,
      collateralToken,
    } = this.props
    const resolutionDate = moment(resolution).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)

    const bounds = market.bounds ? {
      upperBound: market.bounds.upper,
      lowerBound: market.bounds.lower,
      unit: market.bounds.unit,
      decimals: market.bounds.decimals,
    } : {}

    const outcomes = market.outcomes ? market.outcomes.map(outcome => outcome.name).toArray() : []

    return (
      <button
        onClick={this.handleViewMarket}
        type="button"
        className={cx('market', {
          resolved,
          closed,
        })}
      >
        <div className={cx('header')}>
          <h2 className={cx('title')}>{title}</h2>
        </div>
        <Outcome
          resolved={market.resolved}
          type={market.type}
          outcomeTokensSold={market.outcomeTokensSold.toArray()}
          resolution={market.resolution}
          funding={market.funding}
          outcomes={outcomes}
          winningOutcome={market.winningOutcome}
          {...bounds}
        />
        <div className={cx('info', 'row')}>
          <div className={cx('group', 'col-md-3')}>
            <MarketStatus
              resolved={resolved}
              closed={closed}
              resolution={resolution}
            />
          </div>
          <div className={cx('group', 'col-md-3')}>
            <MarketResolution resolution={resolutionDate} />
          </div>
          {volume && (
            <div className={cx('group', 'col-md-3')}>
              <MarketTrading volume={decimalToText(new Decimal(volume).div(1e18))} collateralToken={collateralToken} />
            </div>
          )}
        </div>
      </button>
    )
  }
}

Market.propTypes = {
  market: PropTypes.instanceOf(Record).isRequired,
  address: PropTypes.string.isRequired,
  resolved: PropTypes.bool.isRequired,
  closed: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  resolution: PropTypes.string.isRequired,
  volume: PropTypes.string,
  collateralToken: PropTypes.string.isRequired,
  viewMarket: PropTypes.func.isRequired,
}

Market.defaultProps = {
  volume: undefined,
}

export default Market
