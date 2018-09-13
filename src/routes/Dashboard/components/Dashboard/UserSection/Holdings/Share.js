import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { LOWEST_VALUE } from 'utils/constants'
import { weiToEth } from 'utils/helpers'
import { OutcomeRecord } from 'store/models/market'

import style from './style.scss'

const cx = className.bind(style)

const Share = ({
  id,
  marketTitle,
  marketType,
  market,
  outcomeToken,
  collateralTokenAddress,
  balance,
  marginalPrice,
  redeemWinnings,
  winnings,
}) => {
  const showSellLink = !market.closed && !market.resolved
  const showRedeemLink = market.resolved && winnings >= LOWEST_VALUE

  const handleRedeemWinnings = () => redeemWinnings(market)

  return (
    <div className={cx('share', 'category')}>
      <div className={cx('row')}>
        <Link className={cx('title', 'col-md-12')} to={`/markets/${market.address}`} title={marketTitle}>
          {marketTitle}
        </Link>
      </div>
      <div className={cx('outcome')}>
        <div className={cx('outcomeBox')}>
          <OutcomeColorBox scheme={marketType} outcomeIndex={outcomeToken.index} />
          &nbsp;
          <span className={cx('outcomeText')}>{outcomeToken.name}</span>
        </div>
        <div className={cx('shareAmount')}>
          <DecimalValue value={weiToEth(balance)} />
        </div>
        <div className={cx('sharePrice')}>
          <DecimalValue value={marginalPrice} />
          &nbsp;
          {collateralTokenAddress ? <CurrencyName tokenAddress={collateralTokenAddress} /> : <span>ETH</span>}
        </div>
        <div className={cx('shareAction')}>
          {showSellLink && <Link to={`/markets/${market.address}/my-shares/${id}`}>SELL</Link>}
          {showRedeemLink && (
            <button className={cx('redeemWinnings', 'btn', 'btn-link')} type="button" onClick={handleRedeemWinnings}>
              REDEEM WINNINGS
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

Share.propTypes = {
  id: PropTypes.string.isRequired,
  marketTitle: PropTypes.string.isRequired,
  marketType: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
  balance: PropTypes.string.isRequired,
  marginalPrice: PropTypes.number.isRequired,
  outcomeToken: PropTypes.shape(OutcomeRecord).isRequired,
  collateralTokenAddress: PropTypes.string.isRequired,
  redeemWinnings: PropTypes.func.isRequired,
  winnings: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default Share
