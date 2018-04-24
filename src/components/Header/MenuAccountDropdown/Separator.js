import React from 'react'
import cn from 'classnames/bind'
import style from './dropdown.scss'

const cx = cn.bind(style)

const Separator = () => <li className={cx('separator')} />

export default Separator
