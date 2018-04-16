import React from 'react'
import PropTypes from 'prop-types'

import className from 'classnames/bind'

import styles from './InputError.mod.scss'

const cx = className.bind(styles)

const InputError = ({ error, style }) =>
  (error ? (
    <span className={cx('inputError')} style={style}>
      {error}
    </span>
  ) : null)

InputError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  // eslint-disable-next-line
  style: PropTypes.object,
}

InputError.defaultProps = {
  error: undefined,
  style: {},
}

export default InputError
