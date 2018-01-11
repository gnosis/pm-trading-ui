import classNames from 'classnames/bind'
import Decimal from 'decimal.js'
import * as React from 'react'

import WalletAddress from 'components/WalletAddress'

import * as css from './index.css'

const crystal = require('components/Dashboard/Metrics/assets/badges/crystal-gazer.svg')
const clairvoyant = require('components/Dashboard/Metrics/assets/badges/clairvoyant.svg')
const fortune = require('components/Dashboard/Metrics/assets/badges/fortune-teller.svg')
const junior = require('components/Dashboard/Metrics/assets/badges/junior-predictor.svg')
const psychic = require('components/Dashboard/Metrics/assets/badges/psychic.svg')

const cx = classNames.bind(css)

export const badgeOf = (value) => {
  const unknown = {
    name: 'Unknown',
    icon: crystal,
  }

  const isJunior = value >= 0 && value <= 4
  if (isJunior) {
    return {
      name: 'Junior Predictor',
      icon: junior,
    }
  }

  const isGazer = value >= 5 && value <= 9
  if (isGazer) {
    return {
      name: 'Crystal Gazer',
      icon: crystal,
    }
  }

  const isFortune = value >= 10 && value <= 14
  if (isFortune) {
    return {
      name: 'Fortune Teller',
      icon: fortune,
    }
  }

  const isClairvoyant = value >= 15 && value <= 19
  if (isClairvoyant) {
    return {
      name: 'Clairvoyant',
      icon: clairvoyant,
    }
  }

  const isPsychic = value >= 20
  if (isPsychic) {
    return {
      name: 'Psychic',
      icon: psychic,
    }
  }

  return unknown
}

export const rankCell = (props) => {
  const diff = props.row.diffRank
  const color = diff == 0 ? 'neutralRank' : diff > 0 ? 'greenRank' : 'redRank'
  const value = diff == 0 ? '-' : diff > 0 ? `+${diff}` : diff
  return <span className={cx(color)}>{ value }</span>
}

export const olyCell = prop => (props) => {
  const value = props.row[prop]
  const result = Decimal(value)
    .div(1e18)
    .toDP(4, 1)
    .toString()
  return <span>{ result }</span>
}

export const badgeCell = (props) => {
  const value = props.row.predictions
  const result = badgeOf(value).name

  return <span>{ result }</span>
}

export const rewardCell = (props) => {
  const position = props.row.currentRank
  let result = ''

  if (position == 1) {
    result = '10 GNO'
  }

  if (position == 2) {
    result = '9 GNO'
  }

  if (position == 3) {
    result = '8 GNO'
  }

  if (position == 4) {
    result = '7 GNO'
  }

  if (position == 5) {
    result = '6 GNO'
  }

  if (position == 6) {
    result = '5 GNO'
  }

  if (position == 7) {
    result = '4 GNO'
  }

  if (position == 8) {
    result = '3 GNO'
  }

  if (position == 9) {
    result = '2 GNO'
  }

  if (position == 10) {
    result = '1 GNO'
  }

  if (position > 10 && position <= 20) {
    result = '0.9 GNO'
  }

  if (position > 20 && position <= 30) {
    result = '0.8 GNO'
  }

  if (position > 30 && position <= 40) {
    result = '0.7 GNO'
  }

  if (position > 40 && position <= 50) {
    result = '0.6 GNO'
  }

  if (position > 50 && position <= 60) {
    result = '0.5 GNO'
  }

  if (position > 60 && position <= 70) {
    result = '0.4 GNO'
  }

  if (position > 70 && position <= 80) {
    result = '0.3 GNO'
  }

  if (position > 80 && position <= 90) {
    result = '0.2 GNO'
  }

  if (position > 90 && position <= 100) {
    result = '0.1 GNO'
  }

  const style = result ? { color: '#90712b', letterSpacing: '0.5px' } : undefined

  return <span style={style}>{ result }</span>
}

export const userAddressCell = props => (
  <WalletAddress address={props.value} />
)

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
