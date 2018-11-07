import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames/bind'
import Tooltip from 'rc-tooltip'
import Decimal from 'decimal.js'
import { withNamespaces } from 'react-i18next'

import Indefinite from 'components/Spinner/Indefinite'
import DecimalValue from 'components/DecimalValue'

import css from './Balance.scss'

const cx = className.bind(css)

const Balance = ({
  tokenBalance, tokenSymbol, etherBalance, isWrappedEther, t,
}) => {
  if (!tokenBalance) {
    return <Indefinite width={24} height={24} />
  }

  const balance = <DecimalValue value={tokenBalance} className={cx('text')} />
  if (isWrappedEther) {
    const balanceTooltip = (
      <div className={cx('weth-explanation')}>
        <strong>
          {Decimal(tokenBalance)
            .sub(etherBalance)
            .toDP(3)
            .toString()}{' '}
          {tokenSymbol === 'ETH' ? 'WETH' : tokenSymbol}
        </strong>&nbsp;
        +{' '}
        <strong>
          {Decimal(etherBalance)
            .toDP(3)
            .toString()}&nbsp;
          ETH
        </strong>
        <p>
          {t('header.wrapped_ether_title')}
          <br />
          <a href="https://weth.io" target="_blank" rel="noopener noreferrer">
            {t('header.wrapped_ether_weth_link')}
          </a>
        </p>
      </div>
    )

    return (
      <span>
        {balance}&nbsp;
        <Tooltip overlay={balanceTooltip} placement="bottom" trigger={['hover', 'focus']}>
          <span className={cx('symbol', 'wrapped')}>{tokenSymbol}</span>
        </Tooltip>
      </span>
    )
  }

  return (
    <div>
      {balance}&nbsp;<span className={cx('symbol')}>{tokenSymbol}</span>
    </div>
  )
}

Balance.propTypes = {
  tokenBalance: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string,
  etherBalance: PropTypes.string,
  isWrappedEther: PropTypes.bool,
  t: PropTypes.func.isRequired,
}

Balance.defaultProps = {
  tokenSymbol: 'ETH',
  etherBalance: '0',
  isWrappedEther: false,
}

export default withNamespaces()(Balance)
