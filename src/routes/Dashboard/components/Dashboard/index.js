import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import DashboardMetrics from './Metrics'
import DashboardTitle from './Title'
import DashboardOverview from './Overview'

import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({ markets }) => (
  <div className={cx('dashboard')}>
    <DashboardTitle />
    <DashboardMetrics />
    <DashboardOverview />
  </div>
)

export default Dashboard
