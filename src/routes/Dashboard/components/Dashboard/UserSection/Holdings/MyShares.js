import React from 'react'
import { Link } from 'react-router-dom'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import { weiToEth } from 'utils/helpers'

import style from './MyShares.mod.scss'

const cx = className.bind(style)

const Share = ({ share }) => (
  <Link className={cx('share')} to="/markets/list">
    <div className={cx('title')}>{share.marketTitle}</div>
    <div className={cx('outcome', 'row')}>
      <div className={cx('outcomeBox', 'col-md-3')}><OutcomeColorBox scheme={share.marketType} outcomeIndex={share.outcomeToken.index} /> {share.outcomeToken.name}</div>
      <div className={cx('shareAmount', 'col-md-2')}><DecimalValue value={weiToEth(share.balance)} /></div>
      <div className={cx('sharePrice', 'col-md-2')}><DecimalValue value={share.marginalPrice} /></div>
    </div>
  </Link>
)

const MyShares = ({ shares }) => (
  <div>
    {shares.map(share => <Share key={share.id} share={share} />)}
  </div>
)

export default MyShares
