import React from 'react'
import classname from 'classnames/bind'
import { compose, lifecycle, withState } from 'recompose'
import { REQUEST_STATES } from 'utils/constants'
import { setRequestStateWrap } from 'utils/helpers'

import style from './UserSection.mod.scss'

import { MyShares, MyTrades } from './Holdings'

const cx = classname.bind(style)

const UserSection = () => (
  <div className={cx('userSection')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <MyShares />
        </div>
        <div className={cx('col-md-6')}>
          <MyTrades />
        </div>
      </div>
    </div>
  </div>
)

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

