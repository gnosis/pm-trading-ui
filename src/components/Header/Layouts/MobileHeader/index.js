import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cn from 'classnames/bind'
import BurgerIcon from './BurgerIcon'
import style from './MobileHeader.scss'
import './BurgerMenuStyles.scss?raw'

const cx = cn.bind(style)

const MobileHeader = ({ logoVars }) => (
  <div className={cx('headerMobileContainer')}>
    <div className={cx('logo')}>
      <NavLink to="/markets/list">
        <div className={cx('headerLogo', 'beta')} style={logoVars} />
      </NavLink>
    </div>
    <Menu right customBurgerIcon={<BurgerIcon />}>
      <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
        Markets
      </NavLink>
    </Menu>
  </div>
)

export default MobileHeader
