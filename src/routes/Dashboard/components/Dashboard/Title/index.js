import React from 'react'

import classname from 'classnames/bind'
import style from './DashboardTitle.mod.scss'

const cx = classname.bind(style)

const Title = () => (
  <div className={cx('dashboardTitle', 'container')}>
    <h1>Dashboard</h1>
  </div>
)

export default Title
