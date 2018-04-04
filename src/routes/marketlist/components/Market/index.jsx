import { Record } from 'immutable'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { decimalToText } from 'components/DecimalValue'
import Outcome from 'components/Outcome'

import Decimal from 'decimal.js'
import moment from 'moment'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import MarketResolution from './MarketResolution.jsx'
import MarketStatus from './MarketStatus.jsx'
import MarketTrading from './MarketTrading.jsx'

import css from '../Market.mod.scss'

const cx = classNames.bind(css)

const onResolve = event => event.stopPropagation()

const ResolveButton = ({ url }) => (
  <div className="market__control">
    <NavLink to={url} onClick={onResolve}>
      Resolve
    </NavLink>
  </div>)

ResolveButton.propTypes = {
  url: PropTypes.string,
  show: PropTypes.bool,
}

ResolveButton.defaultProps = {
  url: '',
  show: false,
}

class Market extends React.PureComponent {
  render() {
    const { market } = this.props
    const {
      address,
      resolved,
      closed,
      isOwner,
      title,
      resolution,
      volume,
      collateralToken,
    } = this.props

    const showResolveButton = isOwner && !resolved
    const viewUrl = `/markets/${address}`
    const resolveUrl = `/markets/${address}/resolve`
    const resolutionDate = moment(resolution).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
    const tradingVolume = decimalToText(new Decimal(volume).div(1e18))

    return (
      <NavLink
        to={viewUrl}
        onClick={onResolve}
        className={cx('market', {
          resolved,
          closed,
        })}
      >
        <div className={cx('header')}>
          <h2 className={cx('title')}>{title}</h2>
          {showResolveButton && <ResolveButton url={resolveUrl} />}
        </div>
        <Outcome market={market} />
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
          <div className={cx('group', 'col-md-3')}>
            <MarketTrading volume={tradingVolume} collateralToken={collateralToken} />
          </div>
        </div>
      </NavLink>
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
  volume: PropTypes.string.isRequired,
  collateralToken: PropTypes.string.isRequired,
}

export default Market
