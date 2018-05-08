import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { compose, lifecycle, withState } from 'recompose'
import { marketRecordListShape } from 'utils/shapes'
import { setRequestStateWrap } from 'utils/helpers'
import { REQUEST_STATES } from 'utils/constants'

import Metrics from './Metrics'
import Title from './Title'
import Markets from './Markets'
import UserSection from './UserSection'

import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({
  marketState, newestMarkets, closingSoonMarkets, viewMarket, myShares, myTrades,
  requestShares, requestTrades, currentAccount,
}) => (
  <div className={cx('dashboard')}>
    <Title />
    <Metrics />
    <Markets
      newestMarkets={marketState !== REQUEST_STATES.SUCCESS ? undefined : newestMarkets}
      closingSoonMarkets={marketState !== REQUEST_STATES.SUCCESS ? undefined : closingSoonMarkets}
      viewMarket={viewMarket}
    />
    <UserSection
      myShares={myShares}
      myTrades={myTrades}
      requestShares={requestShares}
      requestTrades={requestTrades}
      currentAccount={currentAccount}
    />
  </div>
)

Dashboard.propTypes = {
  fetchMarkets: PropTypes.func.isRequired,
  viewMarket: PropTypes.func.isRequired,
  marketState: PropTypes.oneOf(Object.values(REQUEST_STATES)),
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
}

Dashboard.defaultProps = {
  marketState: REQUEST_STATES.UNKNOWN,
  newestMarkets: undefined,
  closingSoonMarkets: undefined,
}

const enhancer = compose(
  withState('marketState', 'setMarketState', REQUEST_STATES.UNKNOWN),
  lifecycle({
    async componentDidMount() {
      await setRequestStateWrap(this.props.setMarketState, this.props.fetchMarkets, this)
    },
  }),
)

export default enhancer(Dashboard)
