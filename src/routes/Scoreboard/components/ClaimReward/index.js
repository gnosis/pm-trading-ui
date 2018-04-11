import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Span from 'components/layout/Span'
import Paragraph from 'components/layout/Paragraph'
import style from './ClaimReward.mod.scss'

const cx = cn.bind(style)

const ClaimReward = ({ openClaimRewardModal }) => (
  <Block className={cx('claimReward')}>
    <Block className={cx('rewardInfoContainer')}>
      <Block className={cx('rewardAmount')}>
        <Span className={cx('infoText', 'amount')}>0.2 GNO</Span>
        <Paragraph className={cx('annotation')}>CLAIMABLE GNO</Paragraph>
      </Block>
      <Block className={cx('timeToClaim')}>
        <Span className={cx('infoText')}>23d 21h 13m</Span>
        <Paragraph className={cx('annotation')}>TIME LEFT TO CLAIM</Paragraph>
      </Block>
    </Block>
    <button className={cx('claimButton')} onClick={openClaimRewardModal}>
      CLAIM NOW
    </button>
  </Block>
)

ClaimReward.propTypes = {
  openClaimRewardModal: PropTypes.func.isRequired,
}

export default ClaimReward
