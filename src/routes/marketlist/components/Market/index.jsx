// import { Record } from 'immutable'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { decimalToText } from 'components/DecimalValue'
// import Outcome from 'components/Outcome'
import Decimal from 'decimal.js'
import moment from 'moment'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import MarketResolution from './MarketResolution.jsx'
import MarketStatus from './MarketStatus.jsx'
import MarketTrading from './MarketTrading.jsx'

const onResolve = event => event.stopPropagation()

const ResolveButton = ({ url, show }) => show && (
  <div className="market__control">
    <NavLink to={url} onClick={onResolve}>
      Resolve
    </NavLink>
  </div>
)

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
    const viewUrl = `/markets/${address}`
    const resolveUrl = `/markets/${address}/resolve`
    const resolutionDate = moment(resolution).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
    const tradingVolume = decimalToText(new Decimal(volume).div(1e18))
    const buttonClass = resolved || closed ? 'market--resolved' : ''

    return (
      <NavLink
        to={viewUrl}
        onClick={onResolve}
        className={cn('market', buttonClass)}
      >
        <div className="market__header">
          <h2 className="market__title">{title}</h2>
          <ResolveButton show={showResolveButton} url={resolveUrl} />
        </div>
        {/* <Outcome market={market} /> */}
        <div className="market__info row">
          <div className="info__group col-md-3">
            <MarketStatus
              resolved={resolved}
              closed={closed}
              resolution={resolution}
            />
          </div>
          <div className="info__group col-md-3">
            <MarketResolution resolution={resolutionDate} />
          </div>
          <div className="info__group col-md-3">
            <MarketTrading volume={tradingVolume} collateralToken={collateralToken} />
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
