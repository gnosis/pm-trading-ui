import classNames from 'classnames/bind'
import Decimal from 'decimal.js'
import * as React from 'react'

import CurrenyName from 'components/CurrencyName'
import WalletAddress from 'components/WalletAddress'
import {
  getRewardLevels,
  getBadgeLevels,
  areBadgesEnabled,
  areRewardsEnabled,
  getRewardTokenSymbol,
} from 'utils/configuration'

import * as css from './index.css'

const cx = classNames.bind(css)

export const rankCell = (props) => {
  const diff = props.row.diffRank
  const color = diff == 0 ? 'neutralRank' : diff > 0 ? 'greenRank' : 'redRank'
  const value = diff == 0 ? '-' : diff > 0 ? `+${diff}` : diff
  return <span className={cx(color)}>{value}</span>
}

export const olyCell = prop => (props) => {
  const value = props.row[prop]
  const result = Decimal(value)
    .div(1e18)
    .toDP(4, 1)
    .toString()
  return <span>{result}</span>
}

export const badgeOf = (value) => {
  const badgeLevels = getBadgeLevels()
  let badge

  badgeLevels.forEach((badgeLevel) => {
    if (
      (value >= badgeLevel.minPredictions && value <= badgeLevel.maxPredictions) || // between min/max
      (value >= badgeLevel.minPredictions && badgeLevel.maxPredictions == null) // above min
    ) {
      badge = badgeLevel
      return false // break
    }
  })

  return badge
}

export const badgeCell = (props) => {
  if (areBadgesEnabled()) {
    const badge = badgeOf(props.row.predictions)

    if (!badge) {
      return null
    }

    return <span>{badge.rank}</span>
  }
}

export const rewardCell = (props) => {
  if (areRewardsEnabled()) {
    const rewardLevels = getRewardLevels()
    const value = props.row.currentRank

    let reward

    rewardLevels.forEach((rewardLevel) => {
      if (
        (value >= rewardLevel.minRank && value <= rewardLevel.maxRank) || // between min/max
        (value >= rewardLevel.minRank && rewardLevel.maxRank == null) // above min
      ) {
        reward = rewardLevel
      }
    })
    const style = reward ? { color: '#90712b', letterSpacing: '0.5px' } : undefined

    const tokenSymbol = getRewardTokenSymbol()

    return <span style={style}>{reward.value} {tokenSymbol}</span>
  }
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
