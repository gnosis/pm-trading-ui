import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cn from 'classnames/bind'
import style from '../Header.scss'

const cx = cn.bind(style)

const MobileHeader = ({ logoVars }) => (
  <div>
    <div className={cx('group', 'logo')}>
      <NavLink to="/markets/list">
        <div className={cx('headerLogo', 'beta')} style={logoVars} />
      </NavLink>
    </div>
    <Menu right>
      <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
        Markets
      </NavLink>
    </Menu>
  </div>
)

export default MobileHeader
