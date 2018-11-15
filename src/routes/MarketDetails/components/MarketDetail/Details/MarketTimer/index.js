import React from 'react'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import Countdown from 'components/Countdown'
import { RESOLUTION_TIME } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import style from './MarketTimer.scss'

const cx = cn.bind(style)

const MarketTimer = ({
  market, showCountdown, marketStatus, showStatus, t,
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
        <div className={cx('timerLabel')}>{t('market.resolution_time')}</div>
      )}
    </div>
    <div className={cx({ marketTimerLive: !showCountdown, marketTimerAbsolute: showCountdown })}>
      {moment
        .utc(market.resolution)
        .local()
        .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
    </div>
    {showStatus && <div className={cx('marketStatus')}>{t(`market.market_status_${marketStatus}`)}</div>}
  </div>
)

MarketTimer.propTypes = {
  market: marketShape.isRequired,
  showCountdown: PropTypes.bool,
  marketStatus: PropTypes.string,
  showStatus: PropTypes.bool,
  t: PropTypes.func.isRequired,
}

MarketTimer.defaultProps = {
  showCountdown: false,
  marketStatus: '',
  showStatus: false,
}

export default withNamespaces()(MarketTimer)
