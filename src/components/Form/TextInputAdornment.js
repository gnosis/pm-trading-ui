import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames/bind'

import styles from './TextInputAdornment.mod.scss'

const cx = className.bind(styles)

const TextInputAdornment = ({ children, position, style }) => {
  const textInputAdornmentClasses = cx('adornment', {
    end: position === 'end',
    start: position === 'start',
  })

  return (
    <p className={textInputAdornmentClasses} style={style}>
      {children}
    </p>
  )
}

TextInputAdornment.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['end', 'start']),
  // eslint-disable-next-line
  style: PropTypes.object,
}

TextInputAdornment.defaultProps = {
  children: undefined,
  position: undefined,
  style: {},
}

export default TextInputAdornment
