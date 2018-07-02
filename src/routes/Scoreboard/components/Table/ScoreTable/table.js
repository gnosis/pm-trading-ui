import classNames from 'classnames/bind'
import Decimal from 'decimal.js'
import * as React from 'react'
import WalletAddress from 'components/WalletAddress'
import {
  isFeatureEnabled,
  getFeatureConfig,
} from 'utils/features'

import * as css from './index.css'

const rewardsEnabled = isFeatureEnabled('rewards')
const badgesEnabled = isFeatureEnabled('badges')

const rewardsConfig = getFeatureConfig('rewards')
const { levels, rewardToken } = rewardsConfig

const badgesConfig = getFeatureConfig('badges')
const { ranks } = badgesConfig

const cx = classNames.bind(css)

export const rankCell = (props) => {
  const diff = props.row.diffRank
  const color = diff == 0 ? 'neutralRank' : diff > 0 ? 'greenRank' : 'redRank'
  const value = diff == 0 ? '-' : diff > 0 ? `+${diff}` : diff
  return (
    <span className={cx(color)}>
      {value}
    </span>
  )
}

export const olyCell = prop => (props) => {
  const value = props.row[prop]
  const result = Decimal(value)
    .div(1e18)
    .toDP(4, 1)
    .toString()
  return (
    <span>
      {result}
    </span>
  )
}

export const badgeOf = (value) => {
  let badge

  ranks.forEach((badgeLevel) => {
    if (
      (value >= badgeLevel.minPredictions && value <= badgeLevel.maxPredictions) // between min/max
      || (value >= badgeLevel.minPredictions && badgeLevel.maxPredictions == null) // above min
    ) {
      badge = badgeLevel
      return false // break
    }
  })

  return badge
}

export const badgeCell = (props) => {
  if (badgesEnabled) {
    const badge = badgeOf(props.row.predictions)

    if (!badge) {
      return null
    }

    return (
      <span>
        {badge.rank}
      </span>
    )
  }
}

export const rewardCell = (props) => {
  if (rewardsEnabled) {
    const value = props.row.currentRank

    let reward = { value: 0 }

    levels.forEach((rewardLevel) => {
      if (
        (value >= rewardLevel.minRank && value <= rewardLevel.maxRank) // between min/max
        || (value >= rewardLevel.minRank && rewardLevel.maxRank == null) // above min
      ) {
        reward = rewardLevel
      }
    })
    const style = reward ? { color: '#90712b', letterSpacing: '0.5px' } : undefined

    return (
      <span style={style}>
        {reward.value ? `${reward.value} ${rewardToken.symbol}` : '--'}
      </span>
    )
  }

  return null
}

export const userAddressCell = props => <WalletAddress address={props.value} />

export const ownTrCallback = myWallet => (state, rowInfo) => ({
  style: {
    background: rowInfo && rowInfo.row.account === myWallet ? '#C7EAF1' : 'transparent',
  },
})

export const ownTheadCallback = () => ({
  style: {
    boxShadow: 'none',
  },
})
