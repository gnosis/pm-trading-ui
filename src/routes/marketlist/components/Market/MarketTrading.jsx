import CurrencyName from 'components/CurrencyName'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames/bind'

import css from '../Market.mod.scss'

import Icon from 'components/Icon'

const cx = classNames.bind(css)

const MarketTrading = ({ volume, collateralToken }) => (
  <div className={cx('marketInfo')}>
    <Icon type="currency" size={25} />
    <div className={cx('label')}>
      {volume}&nbsp;
      <CurrencyName collateralToken={collateralToken} />&nbsp; Volume
    </div>
  </div>
)

MarketTrading.propTypes = {
  volume: PropTypes.string.isRequired,
  collateralToken: PropTypes.string.isRequired,
}

export default MarketTrading
