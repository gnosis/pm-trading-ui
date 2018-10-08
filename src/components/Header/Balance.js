import React from 'react'
import className from 'classnames/bind'
import Tooltip from 'rc-tooltip'
import Decimal from 'decimal.js'

import Indefinite from 'components/Spinner/Indefinite'
import DecimalValue from 'components/DecimalValue'

import css from './Header.scss'

const cx = className.bind(css)

const Balance = ({
  tokenBalance, tokenSymbol, etherBalance, isWrappedEther,
}) => {
  if (!tokenBalance) {
    return <Indefinite width={24} height={24} />
  }

  const balance = <DecimalValue value={tokenBalance} className={cx('text')} />
  if (isWrappedEther) {
    const balanceTooltip = (
      <div className={cx('weth-explanation')}>
        <strong>{Decimal(tokenBalance).sub(etherBalance).toDP(3).toString()} {tokenSymbol}</strong> + <strong>{Decimal(etherBalance).toDP(3).toString()} ETH</strong>
        <p>Your balance is calculated as the sum of your ETH and Wrapped-ETH balance.<br /> <a href="https://weth.io" target="_blank" rel="noopener noreferrer">What&apos;s wrapped ether?</a></p>
      </div>
    )

    return (
      <>{balance} <Tooltip overlay={balanceTooltip} placement="bottom"><span className={cx('symbol', 'wrapped')}>{tokenSymbol}</span></Tooltip></>
    )
  }

  return (
    <>{balance} <span className={cx('symbol')}>{tokenBalance}</span></>
  )
}

Balance.defaultProps = {
  tokenBalance: undefined,
  tokenSymbol: 'ETH',
  etherBalance: '0',
}

export default Balance
