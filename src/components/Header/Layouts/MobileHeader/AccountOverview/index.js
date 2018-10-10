import React from 'react'
import cn from 'classnames/bind'
import Balance from 'components/Header/Balance'
import Identicon from 'components/Header/Identicon'
import CopyIcon from '../assets/icon_copy.svg'
import style from './AccountOverview.scss'

const cx = cn.bind(style)

const formatAddress = address => `${address.slice(0, 10)}...${address.slice(35)}`

const copyIconStyle = {
  width: 15,
  height: 15,
  marginLeft: 5,
}

const AccountOverview = ({
  currentAccount,
  currentNetwork,
  etherBalance,
  tokenBalance,
  tokenSymbol,
  tokenBalanceIsWrappedEther,
  copyAddress,
}) => (
  <div className={cx('overviewContainer')}>
    <div className={cx('networkBalanceWrapper')}>
      <span className={cx('network')}>{currentNetwork}</span>
      <Balance
        etherBalance={etherBalance}
        tokenBalance={tokenBalance}
        tokenSymbol={tokenSymbol}
        isWrappedEther={tokenBalanceIsWrappedEther}
      />
    </div>
    <Identicon account={currentAccount} className={cx('identicon')} />
    <div className={cx('addressWrapper')}>
      <button type="button" className={cx('address')} onClick={copyAddress}>
        {formatAddress(currentAccount)}
      </button>
      <img src={CopyIcon} style={copyIconStyle} alt="Click to copy" />
    </div>
  </div>
)

export default AccountOverview
