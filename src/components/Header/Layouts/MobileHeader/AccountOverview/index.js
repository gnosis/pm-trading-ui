import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Balance from 'components/Header/Balance'
import Identicon from 'components/Header/Identicon'
import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import CopyIcon from '../assets/icon_copy.svg'
import style from './AccountOverview.scss'
import Icon from '../../../../Icon'

const cx = cn.bind(style)

const formatAddress = address => `${address.slice(0, 10)}...${address.slice(35)}`

const copyIconStyle = {
  width: 15,
  height: 15,
  marginLeft: 5,
}
const attentionIconStyle = {
  backgroundSize: 'cover',
  marginRight: 5,
}

const AccountOverview = ({
  currentAccount,
  currentNetwork,
  etherBalance,
  tokenBalance,
  tokenSymbol,
  tokenBalanceIsWrappedEther,
  copyAddress,
  isConnectedToCorrectNetwork,
  targetNetworkId,
}) => (
  <div className={cx('overviewContainer')}>
    <div className={cx('wrongNetwork')}>
      {!isConnectedToCorrectNetwork && (
        <>
          <Icon type="attention-mobile-header" style={attentionIconStyle} />
          Switch to the {ETHEREUM_NETWORK_IDS[ETHtargetNetworkId] || ''} network
        </>
      )}
    </div>
    <div className={cx('networkBalanceWrapper')}>
      <div className={cx('network')}>{currentNetwork} </div>
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

AccountOverview.propTypes = {
  currentAccount: PropTypes.string.isRequired,
  currentNetwork: PropTypes.string,
  etherBalance: PropTypes.string.isRequired,
  tokenBalance: PropTypes.string,
  tokenSymbol: PropTypes.string,
  tokenBalanceIsWrappedEther: PropTypes.bool.isRequired,
  copyAddress: PropTypes.func.isRequired,
  isConnectedToCorrectNetwork: PropTypes.bool.isRequired,
}

AccountOverview.defaultProps = {
  currentNetwork: '',
  tokenBalance: '0',
  tokenSymbol: '',
}

export default AccountOverview
