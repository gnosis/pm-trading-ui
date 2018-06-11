import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import Decimal from 'decimal.js'
import Block from 'components/layout/Block'
import Span from 'components/layout/Span'
import Countdown from 'components/Countdown'
import Paragraph from 'components/layout/Paragraph'
import { getFeatureConfig } from 'utils/features'
import style from './ClaimReward.mod.scss'

const rewardsConfig = getFeatureConfig('rewards')
const { rewardToken, claimReward } = rewardsConfig
const claimUntilFormat = 'y[Y] M[M] D[d] h[h] m[m]'
const rewardsClaimed = window ? window.localStorage.getItem('rewardsClaimed') === 'true' : false
const cx = cn.bind(style)

const claimStartDate = moment.utc(claimReward.claimStart)
const claimEndDate = moment.utc(claimReward.claimUntil)

const ClaimReward = ({ openClaimRewardModal, rewardValue }) => {
  const isInTimeframe = moment.utc().isBetween(claimStartDate, claimEndDate)
  const hasRewards = Decimal(rewardValue || 0).lte(0)
  const hasClaimed = rewardsClaimed

  const showRewardValue = isInTimeframe && !hasClaimed
  const showAlreadyClaimed = isInTimeframe && hasClaimed

  const enabledClaiming = !isInTimeframe || !hasClaimed || !hasRewards

  let rewardValueDisplay = 'N/A'
  if (showRewardValue) {
    rewardValueDisplay = `${rewardValue} ${rewardToken.symbol}`
  } else if (showAlreadyClaimed) {
    rewardValueDisplay = 'Already claimed'
  }

  let rewardClaimTimeDisplay = <span>N/A</span>
  if (showRewardValue || showAlreadyClaimed) {
    rewardClaimTimeDisplay = <Countdown className={cx('infoText')} target={claimReward.claimUntil} format={claimUntilFormat} />
  }

  return (
    <Block className={cx('claimReward')}>
      <Block className={cx('rewardInfoContainer')}>
        <Block className={cx('rewardAmount')}>
          <Span className={cx('infoText', 'amount')}>
            {rewardValueDisplay}
          </Span>
          <Paragraph className={cx('annotation')}>CLAIMABLE {rewardToken.symbol}</Paragraph>
        </Block>
        <Block className={cx('timeToClaim')}>
          {rewardClaimTimeDisplay}
          <Paragraph className={cx('annotation')}>TIME LEFT TO CLAIM</Paragraph>
        </Block>
      </Block>
      <button
        className={cx('claimButton')}
        onClick={openClaimRewardModal}
        disabled={enabledClaiming}
      >
        CLAIM NOW
      </button>
    </Block>
  )
}

ClaimReward.propTypes = {
  openClaimRewardModal: PropTypes.func.isRequired,
  rewardValue: PropTypes.number.isRequired,
}

export default ClaimReward
