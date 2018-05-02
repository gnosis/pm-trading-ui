import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import style from './dropdown.scss'

const cx = cn.bind(style)

const List = ({ children }) => (
  <ul className={cx('list')}>
    {children}
  </ul>
)

List.propTypes = {
  children: PropTypes.node.isRequired,
}

export default List
