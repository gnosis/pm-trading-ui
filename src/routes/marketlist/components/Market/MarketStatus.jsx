import cn from 'classnames'
import Countdown from 'components/Countdown'
import PropTypes from 'prop-types'
import React from 'react'
import { RESOLUTION_TIME } from 'utils/constants'

const MarketStatus = ({ resolved, closed, resolution }) => {
  const hasStatus = resolved || closed
  const status = resolved ? 'resolved' : 'closed'

  const iconStyle = hasStatus ? 'icon--checkmark' : 'icon--countdown'

  return (
    <div className="info_field">
      <div className={cn('info__field--icon', 'icon', iconStyle)} />
      <div className="info__field--label">
        { hasStatus
          ? status
          : <Countdown target={resolution} format={RESOLUTION_TIME.RELATIVE_FORMAT} />
        }
      </div>
    </div>
  )
}

MarketStatus.propTypes = {
  resolved: PropTypes.bool.isRequired,
  closed: PropTypes.bool.isRequired,
  resolution: PropTypes.string.isRequired,
}

export default MarketStatus
