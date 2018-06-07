import React from 'react'
import Decimal from 'decimal.js'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames/bind'
import { compose, lifecycle, withState } from 'recompose'
import { marketRecordListShape } from 'utils/shapes'
import { setRequestStateWrap } from 'utils/helpers'
import { REQUEST_STATES } from 'utils/constants'
import TradeRecord from 'store/models/trade'
import ShareRecord from 'store/models/share'

import Metrics from './Metrics'
import Title from './Title'
import Markets from './Markets'
import UserSection from './UserSection'

import styles from './Dashboard.mod.scss'

const cx = classNames.bind(styles)

const Dashboard = ({
  marketState, newestMarkets, closingSoonMarkets, viewMarket, myShares, myTrades,
  requestShares, requestTrades, currentAccount, collateralToken, predictedProfits,
  redeemWinnings,
}) => (
  <div className={cx('dashboard')}>
    <Title />
    <Metrics collateralToken={collateralToken} predictedProfits={predictedProfits} />
    <Markets
      newestMarkets={marketState === REQUEST_STATES.SUCCESS ? newestMarkets : undefined}
      closingSoonMarkets={marketState === REQUEST_STATES.SUCCESS ? closingSoonMarkets : undefined}
      viewMarket={viewMarket}
    />
    {marketState === REQUEST_STATES.SUCCESS ? (
      <UserSection
        myShares={myShares}
        myTrades={myTrades}
        requestShares={requestShares}
        requestTrades={requestTrades}
        currentAccount={currentAccount}
        redeemWinnings={redeemWinnings}
      />
    ) : undefined}
  </div>
)

Dashboard.propTypes = {
  requestShares: PropTypes.func.isRequired,
  requestTrades: PropTypes.func.isRequired,
  fetchMarkets: PropTypes.func.isRequired,
  redeemWinnings: PropTypes.func.isRequired,
  viewMarket: PropTypes.func.isRequired,
  marketState: PropTypes.oneOf(Object.values(REQUEST_STATES)),
  collateralToken: PropTypes.shape({
    amount: PropTypes.string,
    address: PropTypes.string,
  }),
  predictedProfits: PropTypes.instanceOf(Decimal),
  currentAccount: PropTypes.string,
  newestMarkets: marketRecordListShape,
  closingSoonMarkets: marketRecordListShape,
  hasWallet: PropTypes.bool,
  myTrades: ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(TradeRecord)),
  myShares: ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(ShareRecord)),
}

Dashboard.defaultProps = {
  marketState: REQUEST_STATES.UNKNOWN,
  newestMarkets: null,
  closingSoonMarkets: null,
  myShares: List(),
  myTrades: List(),
  hasWallet: false,
  collateralToken: {},
  currentAccount: null,
  predictedProfits: Decimal(0),
}

const enhancer = compose(
  withState('marketState', 'setMarketState', REQUEST_STATES.UNKNOWN),
  lifecycle({
    shouldComponentUpdate() {
      if (!this.props.hasWallet) {
        this.props.viewMarketList()
        return false
      }
      return true
    },

    async componentDidMount() {
      await setRequestStateWrap(this.props.setMarketState, this.props.fetchMarkets, this)
    },
  }),
)

export default enhancer(Dashboard)
