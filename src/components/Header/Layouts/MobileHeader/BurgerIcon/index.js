import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import menuIcon from './assets/menu_icon.svg'
import style from './BurgerIcon.scss'

const cx = cn.bind(style)

// the prop is called addClass because prop className is overwriteen by react-burger-menu
const BurgerIcon = ({ addClass }) => (
  <div className={cx('burgerIcon', { [addClass]: !!addClass })}>
    <img src={menuIcon} className={cx('icon')} alt="Menu" />
    <span className={cx('menuLabel')}>MENU</span>
  </div>
)

BurgerIcon.propTypes = {
  addClass: PropTypes.string,
}

BurgerIcon.defaultProps = {
  addClass: '',
}

export default BurgerIcon
