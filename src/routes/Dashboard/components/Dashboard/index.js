import React from 'react'
import PropTypes from 'prop-types'

import DashboardMetrics from './Metrics'
import DashboardTitle from './Title'


import classNames from 'classnames/bind'
import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({ markets }) => (
  <div className={cx('dashboard')}>
    <DashboardTitle />
    <DashboardMetrics />
  </div>
)

export default Dashboard
