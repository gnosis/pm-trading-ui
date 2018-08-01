import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames/bind'

import Icon from 'components/Icon'

import css from './Market.scss'

const cx = classNames.bind(css)

const MarketResolution = ({ resolution }) => (
  <div className={cx('marketInfo')}>
    <Icon type="enddate" size={25} />
    <div className={cx('label')}>
      {resolution}
    </div>
  </div>
)

MarketResolution.propTypes = {
  resolution: PropTypes.string.isRequired,
}

export default MarketResolution
