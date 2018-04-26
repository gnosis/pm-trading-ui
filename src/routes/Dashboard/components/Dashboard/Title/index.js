import React from 'react'

import classname from 'classnames/bind'
import style from '../Dashboard.mod.scss'

const cx = classname.bind(style)

const Title = () => (
  <div className={cx('dashboard-title', 'container')}>
    <h1>Dashboard</h1>
  </div>
)

export default Title
