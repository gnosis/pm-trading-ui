import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames/bind'

import styles from './TextInputAdornment.scss'

const cx = className.bind(styles)

const TextInputAdornment = ({ children, position }) => (
  <p className={cx('adornment', {
    end: position === 'end',
    start: position === 'start',
  })}
  >
    {children}
  </p>
)

TextInputAdornment.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['end', 'start']),
}

TextInputAdornment.defaultProps = {
  children: undefined,
  position: undefined,
}

export default TextInputAdornment
