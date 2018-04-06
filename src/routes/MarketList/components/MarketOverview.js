import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import css from './MarketOverview.mod.scss'

const cx = classNames.bind(css)

const MarketsOverview = ({ children }) => (
  <div className={cx('marketOverview')}>
    <div className="container">
      <div className="row">
        {children}
      </div>
    </div>
  </div>
)

MarketsOverview.propTypes = {
  children: PropTypes.node,
}

MarketsOverview.defaultProps = {
  children: null,
}

export default MarketsOverview
