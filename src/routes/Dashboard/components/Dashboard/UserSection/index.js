import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classname from 'classnames/bind'
import { compose, lifecycle, withState } from 'recompose'
import { REQUEST_STATES } from 'utils/constants'
import { setRequestStateWrap } from 'utils/helpers'
import ShareRecord from 'store/models/share'
import TradeRecord from 'store/models/trade'

import style from './UserSection.mod.scss'

import Holdings, { Share, Trade } from './Holdings'
import Category from './Category'

const cx = classname.bind(style)

const UserSection = ({
  myShares, myTrades, tradesStatus, sharesStatus, ...props
}) => (
  <div className={cx('userSection')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <Category className={cx('col-md-6')} isLoading={sharesStatus === REQUEST_STATES.LOADING}>
          <Holdings holdings={myShares} component={Share} {...props} />
        </Category>
        <Category className={cx('col-md-6')} isLoading={tradesStatus === REQUEST_STATES.LOADING}>
          <Holdings holdings={myTrades} component={Trade} {...props} />
        </Category>
      </div>
    </div>
  </div>
)

UserSection.propTypes = {
  myShares: ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(ShareRecord)).isRequired,
  myTrades: ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(TradeRecord)).isRequired,
  tradesStatus: PropTypes.oneOf(Object.values(REQUEST_STATES)),
  sharesStatus: PropTypes.oneOf(Object.values(REQUEST_STATES)),
}

UserSection.defaultProps = {
  tradesStatus: REQUEST_STATES.UNKNOWN,
  sharesStatus: REQUEST_STATES.UNKNOWN,
}

const enhance = compose(
  withState('tradesStatus', 'setTradesStatus', REQUEST_STATES.UNKNOWN),
  withState('sharesStatus', 'setSharesStatus', REQUEST_STATES.UNKNOWN),
  lifecycle({
    async componentDidMount() {
      await Promise.all([
        setRequestStateWrap(this.props.setTradesStatus, this.props.requestTrades, this, this.props.currentAccount),
        setRequestStateWrap(this.props.setSharesStatus, this.props.requestShares, this, this.props.currentAccount),
      ])
    },
  }),
)

export default enhance(UserSection)
