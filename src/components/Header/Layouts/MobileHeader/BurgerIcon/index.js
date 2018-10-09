import React from 'react'
import cn from 'classnames/bind'
import menuIcon from './assets/menu_icon.svg'
import style from './BurgerIcon.scss'

const cx = cn.bind(style)

const BurgerIcon = () => (
  <div className={cx('burgerIcon')}>
    <img src={menuIcon} className={cx('icon')} alt="Menu" />
    <span className={cx('menuLabel')}>MENU</span>
  </div>
)

export default BurgerIcon
