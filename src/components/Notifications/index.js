import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import style from './Notifications.mod.scss'

const cx = cn.bind(style)

const Notifications = ({ notifications, onClick }) => (
  <div>
    {notifications.map(({
      id, title, icon, message,
    }) => (
      <button key={id} className={cx('notification')} onClick={() => onClick()}>
        <div className={cx('title')}>{title}</div>
        <div className={cx('iconContainer')}>
          <div className={cx('icon', `icon--${icon}`)} />
        </div>
        <div className={cx('message')}>{message}</div>
      </button>
    ))}
  </div>
)

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
}

Notifications.defaultProps = {
  notifications: [],
  onClick: () => {},
}

export default Notifications
