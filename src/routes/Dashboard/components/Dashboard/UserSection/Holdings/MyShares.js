import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'
import ShareRecord from 'store/models/share'

import style from './style.mod.scss'

const cx = className.bind(style)

const Share = ({ share, redeemWinnings }) => {
  const showSellLink = !share.market.closed && !share.market.resolved
  const showRedeemLink = share.market.resolved

  return (
    <div className={cx('share', 'category')}>
      <div className={cx('row')}>
        <Link className={cx('title', 'col-md-12')} to={`/markets/${share.market.address}`} title={share.marketTitle}>
          {share.marketTitle}
        </Link>
      </div>
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
          {showRedeemLink && <button className="btn btn-link" type="button" onClick={() => redeemWinnings(share.market)}>REDEEM WINNINGS</button>}
        </div>
      </div>
    </div>
  )
}

Share.propTypes = {
  share: ImmutablePropTypes.recordOf(ShareRecord).isRequired,
  redeemWinnings: PropTypes.func.isRequired,
}

const MyShares = ({ shares, redeemWinnings }) => (
  <div className={cx('shares', 'category')}>
    <h2 className={cx('title')}>My Tokens</h2>
    {shares.size ? (
      shares.map(share => <Share key={share.id} share={share} redeemWinnings={redeemWinnings} />)
    ) : (
      <div className={cx('no-shares')}>
        You don&apos;t have any tokens yet.
      </div>
    )}
  </div>
)

MyShares.propTypes = {
  shares: ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(ShareRecord)).isRequired,
  redeemWinnings: PropTypes.func.isRequired,
}

export default MyShares
