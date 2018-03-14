import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import css from './Icon.mod.scss'

const cx = classNames.bind(css)

const Icon = ({ type, size, float }) => {
  // eslint-disable-next-line
  const icon = require(`assets/img/icons/icon_${type}.svg`)

  const iconStyle = {
    backgroundImage: `url(${icon})`,
    width: `${size}px`,
    height: `${size}px`,
    float,
  }

  return (
    <div
      className={cx('icon')}
      style={iconStyle}
    />
  )
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
  float: PropTypes.string,
}

Icon.defaultProps = {
  float: 'none',
  size: 16,
}

export default Icon
