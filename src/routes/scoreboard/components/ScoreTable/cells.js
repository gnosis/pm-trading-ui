import classNames from 'classnames/bind'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

export const rankCell = (props) => {
    const diff = props.row.diffRank;
    const color = diff == 0 ? 'neutralRank' : diff > 0 ? 'greenRank' : 'redRank'
    const value = diff == 0 ? '-' : diff;
    return <span className={ cx(color) }>{ value }</span>
}

export const olyCell = prop => (props) => {
    const value = props.row[prop];
    const result = value.substr(0, 1) + '.' + value.substr(1,2);
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
