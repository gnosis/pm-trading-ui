import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { lifecycle } from 'recompose'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './ClaimReward.mod.scss'

const cx = cn.bind(style)

const ClaimReward = ({
  closeModal,
  currentAccount,
  currentBalance,
  gasPrice,
}) => {
  const handleRegistration = async () => {
    closeModal()
  }
  const disabled = false

  return (
    <div className={cx('registerWallet')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('registerContainer')}>
        <h4 className={cx('heading')}>Claim GNO</h4>
        <p className={cx('annotation')}>
          In order to claim your <span className={cx('rewardInfo')}>0.2 GNO</span> tokens, you first have to switch to
          the MAINNET network in your MetaMask wallet. Also make sure you have enough ETH to submit the transaction with
          the claim request. More information in FAQ.
        </p>
        <p className={cx('walletAnnotation')}>Your current Metamask address is:</p>
        <div className={cx('walletAddressContainer')}>
          <img src={WalletIcon} className={cx('walletIcon')} alt="" />
          <h4 className={cx('walletAddress')}>{currentAccount}</h4>
        </div>
        <p className={cx('rinkebyEthAnnotation')}>
          You need Rinkeby ETH to register your wallet address. <br />Rinkeby ETH balance:{' '}
          <DecimalValue value={currentBalance} className={cx('walletBalance')} /> -{' '}
          <a className={cx('faucetLink')} href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">
            Request Rinkeby Ether
          </a>
          <img src={LinkIcon} className={cx('linkIcon')} alt="" />
        </p>
        <InteractionButton onClick={handleRegistration} className={cx('btn', 'btn-primary')} disabled={disabled}>
          REGISTER ADDRESS
        </InteractionButton>
      </div>
    </div>
  )
}

ClaimReward.propTypes = {
  closeModal: PropTypes.func.isRequired,
  currentAccount: PropTypes.string.isRequired,
  currentBalance: PropTypes.string.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal).isRequired,
  registrationGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default lifecycle({
  componentDidMount() {
    this.props.requestGasPrice()
  },
})(ClaimReward)
