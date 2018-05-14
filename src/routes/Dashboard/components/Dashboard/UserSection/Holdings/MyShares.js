import React from 'react'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import { weiToEth } from 'utils/helpers'

import style from './MyShares.mod.scss'

const cx = className.bind(style)

const Share = ({ share }) => (
  <div className={cx('share')} key={share.id}>
    <div className={cx('title')}>{share.marketTitle}</div>
    <div className={cx('outcome')}>
      <OutcomeColorBox />
      <div className={cx('shareAmount')}><DecimalValue value={weiToEth(share.balance)} /></div>
      <div className={cx('sharePrice')}><DecimalValue value={share.marginalPrice} /></div>
    </div>
  </div>
)

const MyShares = ({ shares }) => (
  <div>
    {shares.map(share => <Share share={share} />)}
  </div>
)

export default MyShares
