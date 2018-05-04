import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { compose, lifecycle, withState } from 'recompose'
import { marketRecordListShape } from 'utils/shapes'

import DashboardMetrics from './Metrics'
import DashboardTitle from './Title'
import DashboardOverview from './Overview'

import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({
  loadingMarkets, newestMarkets, closingSoonMarkets, viewMarket,
}) => (
  <div className={cx('dashboard')}>
    <DashboardTitle />
    <DashboardMetrics />
    <DashboardOverview
      newestMarkets={loadingMarkets ? undefined : newestMarkets}
      closingSoonMarkets={loadingMarkets ? undefined : closingSoonMarkets}
      viewMarket={viewMarket}
    />
  </div>
)

Dashboard.propTypes = {
  fetchMarkets: PropTypes.func.isRequired,
  viewMarket: PropTypes.func.isRequired,
  loadingMarkets: PropTypes.bool.isRequired,
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
}

Dashboard.defaultProps = {
  newestMarkets: undefined,
  closingSoonMarkets: undefined,
}

const enhancer = compose(
  withState('loadingMarkets', 'setLoadingMarkets', false),
  lifecycle({
    async componentDidMount() {
      this.props.setLoadingMarkets(true)
      await this.props.fetchMarkets()
      this.props.setLoadingMarkets(false)
    },
  }),
)

export default enhancer(Dashboard)
