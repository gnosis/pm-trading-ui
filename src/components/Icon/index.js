import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import css from './Icon.mod.scss'

const cx = classNames.bind(css)

const Icon = ({
  src, type, size, float, style, ...props
}) => {
  let icon
  if (src) {
    icon = src
  } else {
    // eslint-disable-next-line
      icon = require(`assets/img/icons/icon_${type}.svg`)
  }

  const iconStyle = {
    backgroundImage: `url(${icon})`,
    width: `${size}px`,
    height: `${size}px`,
    float,
    ...style,
  }

  return (
    <div
      {...props}
      className={cx('icon')}
      style={iconStyle}
    />
  )
}

Icon.propTypes = {
  src: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.number,
  float: PropTypes.string,
  style: PropTypes.shape({}),
}

Icon.defaultProps = {
  src: undefined,
  type: 'etherTokens',
  float: 'none',
  size: 16,
  style: {},
}

export default Icon
