import classNames from 'classnames/bind'
import * as React from 'react'
import { weiToEth } from 'utils/helpers';

import * as css from './index.css'

const cx = classNames.bind(css)

export const badgeOf = (value) => {
    const unknown = 'Unknown'
    
    const isJunior = value >= 0 && value <= 4;
    if (isJunior) {
        return 'Junior Predictor'
    }

    const isGazer = value >= 5 && value <= 9;
    if (isGazer) {
        return 'Crystal Gazer'
    }

    const isFortune = value >= 10 && value <= 14;
    if (isFortune) {
        return 'Fortune Teller'
    }

    const isClairvoyant = value >= 15 && value <= 19;
    if (isClairvoyant) {
        return 'Clairvoyant'
    }

    const isJPsychic = value >= 20;
    if (isJPsychic) {
        return 'Psychic'
    }

    return unknown
}

export const rankCell = (props) => {
    const diff = props.row.diffRank;
    const color = diff == 0 ? 'neutralRank' : diff > 0 ? 'greenRank' : 'redRank'
    const value = diff == 0 ? '-' : diff;
    return <span className={ cx(color) }>{ value }</span>
}

export const olyCell = prop => (props) => {
    const value = props.row[prop]
    const result = weiToEth(value)
    return <span>{ result }</span>
}

export const badgeCell = (props) => {
    const value = props.row.predictions
    const result = badgeOf(value)
    
    return <span>{ result }</span>
}

export const rewardCell = props => {
    const position = props.row.currentRank
    let result = ''
    
    if (position == 1) {
        result = '100 GNO'
    }

    if (position == 2) {
        result = '75 GNO'
    }

    if (position == 3) {
        result = '50 GNO'
    }

    if (position == 4) {
        result = '40 GNO'
    }

    if (position == 5) {
        result = '10 GNO'
    }
    
    const style = result ? { color: '#90712b', letterSpacing: '0.5px' } : undefined
    
    return <span style={ style }>{ result }</span>
}

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
