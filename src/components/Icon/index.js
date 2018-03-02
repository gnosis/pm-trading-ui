import React from 'react'
import classNames from 'classnames/bind'

import css from './Icon.mod.scss'

const cx = classNames.bind(css)

const Icon = ({ type, size }) => {
  // eslint-disable-next-line
  const icon = require(`assets/img/icons/icon_${type}.svg`)

  const iconStyle = {
    backgroundImage: `url(${icon})`,
    width: `${size}px`,
    height: `${size}px`,
  }

  return (
    <div
      className={cx('icon')}
      style={iconStyle}
    />
  )
}

export default Icon
