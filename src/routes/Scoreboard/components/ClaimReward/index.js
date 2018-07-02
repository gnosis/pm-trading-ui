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
import { connect } from 'react-redux'
import { areRewardsClaimed } from '../../store'
import style from './ClaimReward.mod.scss'

const rewardsConfig = getFeatureConfig('rewards')
const rewardClaimingConfig = getFeatureConfig('rewardClaiming')
const { rewardToken } = rewardsConfig
const { claimReward } = rewardClaimingConfig
const claimUntilFormat = 'y[Y] M[M] D[d] h[h] m[m]'
const cx = cn.bind(style)

const claimStartDate = moment.utc(claimReward.claimStart)
const claimEndDate = moment.utc(claimReward.claimUntil)

const ClaimReward = ({ openClaimRewardModal, rewardValue, rewardsClaimed }) => {
  const isInTimeframe = moment.utc().isBetween(claimStartDate, claimEndDate)
  const hasRewards = Decimal(rewardValue || 0).gt(0)
  const claimRewardEnabled = claimReward.enabled

  const showRewardValue = claimRewardEnabled && isInTimeframe && !rewardsClaimed
  const showAlreadyClaimed = isInTimeframe && rewardsClaimed

  const claimingDisabled = !claimRewardEnabled || !isInTimeframe || !rewardsClaimed || !hasRewards

  let rewardValueDisplay = 'N/A'
  if (showRewardValue) {
    rewardValueDisplay = `${rewardValue} ${rewardToken.symbol}`
  } else if (showAlreadyClaimed) {
    rewardValueDisplay = 'Already claimed'
  }

  let rewardClaimTimeDisplay = (
    <span className={cx('infoText')}>
N/A
    </span>
  )
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
          <Paragraph className={cx('annotation')}>
CLAIMABLE
            {rewardToken.symbol}
          </Paragraph>
        </Block>
        <Block className={cx('timeToClaim')}>
          {rewardClaimTimeDisplay}
          <Paragraph className={cx('annotation')}>
TIME LEFT TO CLAIM
          </Paragraph>
        </Block>
      </Block>
      <button
        className={cx('claimButton')}
        onClick={openClaimRewardModal}
        disabled={claimingDisabled}
      >
        CLAIM NOW
      </button>
    </Block>
  )
}

ClaimReward.propTypes = {
  openClaimRewardModal: PropTypes.func.isRequired,
  rewardValue: PropTypes.number.isRequired,
  rewardsClaimed: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  rewardsClaimed: areRewardsClaimed(state),
})

export default connect(mapStateToProps, null)(ClaimReward)
