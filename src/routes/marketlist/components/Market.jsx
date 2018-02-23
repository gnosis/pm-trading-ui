// import { Record } from 'immutable'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { decimalToText } from 'components/DecimalValue'
// import Outcome from 'components/Outcome'
import CurrencyName from 'components/CurrencyName'
import Decimal from 'decimal.js'
import moment from 'moment'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import MarketStatus from './MarketStatus.jsx'

const onResolve = event => event.stopPropagation()

class Market extends React.PureComponent {
  render() {
    // const { market } = this.props // TODO delete
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
    const viewUrl = `/markets/${address}/resolve`
    const resolveUrl = `/markets/${address}/resolve`
    const resolutionDate = moment(resolution).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
    const tradingVolume = decimalToText(new Decimal(volume).div(1e18))

    return (
      <NavLink
        to={viewUrl}
        onClick={onResolve}
        className={cn('market', {
          'market--resolved': resolved || closed,
        })}
      >
        <div className="market__header">
          <h2 className="market__title">{title}</h2>
          {showResolveButton && (
            <div className="market__control">
              <NavLink to={resolveUrl} onClick={onResolve}>
                Resolve
              </NavLink>
            </div>
          )}
        </div>
        {/* <Outcome market={market} /> */}
        <div className="market__info row">
          <div className="info__group col-md-3">
            <div className="info__field">
              <MarketStatus
                resolved={resolved}
                closed={closed}
                resolution={resolution}
              />
            </div>
          </div>
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--enddate" />
              <div className="info__field--label">
                {resolutionDate}
              </div>
            </div>
          </div>
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--currency" />
              <div className="info__field--label">
                {tradingVolume}&nbsp;
                <CurrencyName collateralToken={collateralToken} />&nbsp; Volume
              </div>
            </div>
          </div>
        </div>
      </NavLink>
    )
  }
}

Market.propTypes = {
  // market: PropTypes.instanceOf(Record).isRequired,
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
