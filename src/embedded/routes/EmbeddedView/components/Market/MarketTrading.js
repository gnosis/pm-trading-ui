import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames/bind'

import Icon from 'components/Icon'

import css from './Market.scss'

const cx = classNames.bind(css)

const MarketTrading = ({ volume }) => (
  <div className={cx('marketInfo')}>
    <Icon type="currency" size={25} />
    <div className={cx('label')}>
      {volume} Volume
    </div>
  </div>
)

MarketTrading.propTypes = {
  volume: PropTypes.string.isRequired,
}

export default MarketTrading
