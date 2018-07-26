import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import Countdown from 'components/Countdown'
import { RESOLUTION_TIME } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import style from './MarketTimer.mod.scss'

const cx = cn.bind(style)

const MarketTimer = ({
  market, showCountdown, marketStatus, showStatus,
}) => (
  <div className={cx('marketTimer')}>
    <div
      className={cx({
        marketTimerLive: true,
        big: !showCountdown,
      })}
    >
      {showCountdown ? (
        <Countdown target={market.resolution} />
      ) : (
        <div className={cx('timerLabel')}>Resolution Time</div>
      )}
    </div>
    <div className={cx({ marketTimerLive: !showCountdown, marketTimerAbsolute: showCountdown })}>
      {moment
        .utc(market.resolution)
        .local()
        .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
    </div>
    {showStatus && <div className={cx('marketStatus')}>{`This market was ${marketStatus}`}</div>}
  </div>
)

MarketTimer.propTypes = {
  market: marketShape.isRequired,
  showCountdown: PropTypes.bool,
  marketStatus: PropTypes.string,
  showStatus: PropTypes.bool,
}

MarketTimer.defaultProps = {
  showCountdown: false,
  marketStatus: '',
  showStatus: false,
}

export default MarketTimer
