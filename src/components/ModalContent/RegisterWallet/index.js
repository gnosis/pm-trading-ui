import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { lifecycle } from 'recompose'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import LegalCompliance from 'containers/LegalCompliance'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import { getFeatureConfig } from 'utils/features'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './RegisterWallet.mod.scss'

const cx = cn.bind(style)
const {
  rewardToken: { symbol: rewardTokenSymbol },
} = getFeatureConfig('rewards')

const RegisterMainnetAddress = ({
  closeModal,
  currentAccount,
  currentBalance,
  updateMainnetAddress,
  gasPrice,
  registrationGasCost,
  collateralToken: { symbol: collateralTokenSymbol },
}) => {
  const handleRegistration = async () => {
    await updateMainnetAddress(currentAccount)
    closeModal()
  }

  const disabled =
    gasPrice
      .mul(registrationGasCost || 0)
      .div(1e18)
      .gt(currentBalance || 0)

  return (
    <div className={cx('registerWallet')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('registerContainer')}>
        <h4 className={cx('heading')}>Register wallet address</h4>
        <p className={cx('annotation')}>
          Please register your wallet address, where we can send you {collateralTokenSymbol} tokens, and subsequently
          your {rewardTokenSymbol} reward. Read our terms of service for more information
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
        <LegalCompliance
          submitButtonLabel="REGISTER ADDRESS"
          submitButtonClassName={cx('btn', 'btn-primary', 'actionButton')}
          submitButtonDisabledClassName={cx('disabled')}
          onSubmitAcceptedDocs={handleRegistration}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

RegisterMainnetAddress.propTypes = {
  closeModal: PropTypes.func.isRequired,
  currentAccount: PropTypes.string.isRequired,
  currentBalance: PropTypes.string.isRequired,
  updateMainnetAddress: PropTypes.func.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal),
  registrationGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
}

RegisterMainnetAddress.defaultProps = {
  gasPrice: Decimal(0),
  registrationGasCost: 0,
}

export default lifecycle({
  componentDidMount() {
    this.props.requestRegistrationGasCost()
    this.props.requestGasPrice()
  },
})(RegisterMainnetAddress)
