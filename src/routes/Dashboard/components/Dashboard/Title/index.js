import React from 'react'

import classname from 'classnames/bind'
import style from './DashboardTitle.scss'

const cx = classname.bind(style)

const Title = () => (
  <div className={cx('dashboardTitle')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-xs-10', 'col-xs-offset-1', 'col-sm-12', 'col-sm-offset-0')}>
          <div className={cx('md')}>
            <h1 className={cx('title')}>Dashboard</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Title
