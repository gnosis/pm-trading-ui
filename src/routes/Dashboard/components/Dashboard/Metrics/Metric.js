import React from 'react'
import PropTypes from 'prop-types'

import IndefiniteSpinner from 'components/Spinner/Indefinite'

import classnames from 'classnames/bind'
import style from './Metrics.scss'

const cx = classnames.bind(style)

const Metric = ({
  src, explanation, children, isLoading,
}) => (
  <div className={cx('metric')}>
    <img className={cx('img')} src={src} width={50} height={50} alt={explanation} />
    {isLoading ? (
      <IndefiniteSpinner width={50} height={50} />
    ) : (
      <div className={cx('panel')}>
        {children}
        <small className={cx('explanation')}>{explanation}</small>
      </div>
    )}
  </div>
)

Metric.propTypes = {
  src: PropTypes.string.isRequired,
  explanation: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
}

Metric.defaultProps = {
  explanation: 'N/A',
  children: <span />,
  isLoading: false,
}

export default Metric
