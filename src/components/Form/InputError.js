import React from 'react'
import PropTypes from 'prop-types'

import className from 'classnames/bind'

import styles from './InputError.mod.scss'

const cx = className.bind(styles)

const InputError = ({ error }) => (
  error ? (<span className={cx('inputError')}>{error}</span>) : null
)

InputError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
}

InputError.defaultProps = {
  error: undefined,
}

export default InputError
