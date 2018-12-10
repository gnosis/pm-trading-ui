import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { connect } from 'react-redux'
import Icon from 'components/Icon'
import { logoutProvider } from 'integrations/store/actions'
import style from './dropdown.scss'

const cx = cn.bind(style)

const LogOut = ({ logout }) => (
  <li key="action-logout" className={cx('action')}>
    <button type="button" onClick={logout}>
      <Icon type="logout" size={13} /> Logout
    </button>
  </li>
)

LogOut.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default connect(
  null,
  {
    logout: logoutProvider,
  },
)(LogOut)
