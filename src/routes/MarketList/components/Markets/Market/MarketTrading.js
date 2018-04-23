import CurrencyName from 'components/CurrencyName'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames/bind'
import { hexWithPrefix } from 'utils/helpers'

import Icon from 'components/Icon'

import css from './Market.mod.scss'

const cx = classNames.bind(css)

const MarketTrading = ({ volume, collateralToken }) => (
  <div className={cx('marketInfo')}>
    <Icon type="currency" size={25} />
    <div className={cx('label')}>
      {volume} <CurrencyName tokenAddress={hexWithPrefix(collateralToken)} /> Volume
    </div>
  </div>
)

MarketTrading.propTypes = {
  volume: PropTypes.string.isRequired,
  collateralToken: PropTypes.string.isRequired,
}

export default MarketTrading
