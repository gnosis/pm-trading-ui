import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { List } from 'immutable'
import { lifecycle } from 'recompose'
import { marketRecordListShape } from 'utils/shapes'

import DashboardMetrics from './Metrics'
import DashboardTitle from './Title'
import DashboardOverview from './Overview'

import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({ newestMarkets, closingSoonMarkets }) => (
  <div className={cx('dashboard')}>
    <DashboardTitle />
    <DashboardMetrics />
    <DashboardOverview
      newestMarkets={newestMarkets}
      closingSoonMarkets={closingSoonMarkets}
    />
  </div>
)

Dashboard.propTypes = {
  fetchMarkets: PropTypes.func.isRequired,
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
}

Dashboard.defaultProps = {
  newestMarkets: List(),
  closingSoonMarkets: List(),
}

export default lifecycle({
  componentDidMount() {
    this.props.fetchMarkets()
  },
})(Dashboard)
