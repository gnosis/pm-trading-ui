import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'

const cx = cn.bind({})

const ClaimReward = () => (
  <Block className={cx('claimReward')}>
    <Block className={cx('rewardInfoContainer')}>
      <Block className={cx('rewardAmount')}>
        <img src={CheckboxIcon} alt="" />
      </Block>
    </Block>
  </Block>
)

export default ClaimReward
