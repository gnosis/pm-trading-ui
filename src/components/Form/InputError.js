import React from 'react'
import className from 'classnames/bind'

import styles from './InputError.scss'

const cx = className.bind(styles)

const InputError = ({ error }) => (
  error ? (<span className={cx('inputError')}>{error}</span>) : null
)

export default InputError
