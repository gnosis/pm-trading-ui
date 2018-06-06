import React from 'react'
import { Link } from 'react-router-dom'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'

import { MARKET_STAGES } from 'store/models/market'

import style from './MyShares.mod.scss'

const cx = className.bind(style)

const Share = ({ share }) => {
  const showSellLink = !share.market.closed && !share.market.resolved
  const showRedeemLink = share.market.resolved

  return (
    <div className={cx('share')}>
      <Link className={cx('title')} to={`/markets/${share.market.address}`}>
        {share.marketTitle}
      </Link>
      <div className={cx('outcome', 'row')}>
        <div className={cx('outcomeBox', 'col-md-3')}>
          <OutcomeColorBox scheme={share.marketType} outcomeIndex={share.outcomeToken.index} />&nbsp;
          {share.outcomeToken.name}
        </div>
        <div className={cx('shareAmount', 'col-md-2')}>
          <DecimalValue value={weiToEth(share.balance)} />
        </div>
        <div className={cx('sharePrice', 'col-md-3')}>
          <DecimalValue value={share.marginalPrice} />&nbsp;
          {share.collateralTokenAddress ? <CurrencyName tokenAddress={share.collateralTokenAddress} /> : <span>ETH</span> }
        </div>
        <div className={cx('shareAction', 'col-md-4')}>
          {showSellLink && <Link to={`/markets/${share.market.address}/my-shares/${share.id}`}>SELL</Link>}
          {showRedeemLink && <Link to={`/markets/${share.market.address}/my-shares`}>REDEEM WINNINGS</Link>}
        </div>
      </div>
    </div>
  )
}
const MyShares = ({ shares }) => (
  <div className={cx('shares')}>
    <h2>My Tokens</h2>
    {shares.map(share => <Share key={share.id} share={share} />)}
  </div>
)

export default MyShares
