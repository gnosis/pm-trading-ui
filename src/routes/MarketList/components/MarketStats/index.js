import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { withNamespaces } from 'react-i18next'

import Icon from 'components/Icon'

import css from './MarketStats.scss'

const cx = classNames.bind(css)

const Stat = ({ name, value, icon }) => (
  <div className={cx('stat')}>
    <Icon type={icon} size={50} float="left" />
    <div className={cx('content')}>
      <span className={cx('value')}>{value}</span>
      <div className={cx('label')}>{name}</div>
    </div>
  </div>
)

Stat.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
}

const MarketStats = ({
  open, newMarkets, endingSoon, t,
}) => (
  <div className={cx('marketStats')}>
    <div className="container">
      <div className="row">
        <div className={cx('col-xs-12')}>
          <div className={cx('inner')}>
            <Stat name={t('markets.open_markets', { count: open })} value={open} icon="market" />
            <Stat name={t('markets.ending_soon', { count: endingSoon })} value={endingSoon} icon="market--countdown" />
            <Stat name={t('markets.new_markets', { count: newMarkets })} value={newMarkets} icon="new" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

MarketStats.propTypes = {
  open: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoon: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(MarketStats)
