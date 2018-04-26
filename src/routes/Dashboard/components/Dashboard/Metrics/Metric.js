import React from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames/bind'
import style from './Metrics.mod.scss'

const cx = classnames.bind(style)

const Metric = ({ src, explanation, children }) => (
  <div className={cx('metric')}>
    <img className={cx('img')} src={src} width={45} height={45} alt={explanation} />
    <div className={cx('panel')}>
      {children}
      <small className={cx('explanation')}>{explanation}</small>
    </div>
  </div>
)

Metric.propTypes = {
  src: PropTypes.string.isRequired,
  explanation: PropTypes.string,
  children: PropTypes.node,
}

Metric.defaultProps = {
  explanation: 'N/A',
  children: <span />,
}

export default Metric
