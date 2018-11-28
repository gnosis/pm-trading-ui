import React from 'react'
import cn from 'classnames/bind'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import { compose, lifecycle } from 'recompose'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import LegalCompliance from 'containers/LegalCompliance'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import { getFeatureConfig } from 'utils/features'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './RegisterWallet.scss'

const cx = cn.bind(style)
const {
  rewardToken: { symbol: rewardTokenSymbol },
} = getFeatureConfig('rewards')

const RegisterMainnetAddress = ({
  closeModal,
  currentAccount,
  currentBalance,
  updateMainnetAddress,
  setLegalDocumentsAccepted,
  gasPrice,
  registrationGasCost,
  collateralToken: { symbol: collateralTokenSymbol },
  t,
}) => {
  const handleRegistration = async (documentsAccepted) => {
    await updateMainnetAddress(currentAccount)
    setLegalDocumentsAccepted(documentsAccepted)
    closeModal()
  }

  const insufficientFunds = gasPrice
    .mul(registrationGasCost || 0)
    .div(1e18)
    .gt(currentBalance || 0)

  const disabled = insufficientFunds

  return (
    <div className={cx('registerWallet')}>
      <button type="button" className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('registerContainer')}>
        <h4 className={cx('heading')}>{t('register_wallet.heading')}</h4>
        <p className={cx('annotation')}>
          {t('register_wallet.instructions', { symbol: collateralTokenSymbol, rewardSymbol: rewardTokenSymbol })}
        </p>
        <div className={cx('walletAddressContainer')}>
          <img src={WalletIcon} className={cx('walletIcon')} alt="" />
          <h4 className={cx('walletAddress')}>{currentAccount}</h4>
        </div>
        <p className={cx('rinkebyEthAnnotation')}>
          {t('register_wallet.eth_required')} <br />
          {t('register_wallet.rinkeby_eth_balance')}{' '}
          <DecimalValue value={currentBalance} className={cx('walletBalance')} /> -{' '}
          <a className={cx('faucetLink')} href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">
            {t('register_wallet.rinkeby_eth_request')}
          </a>
          <img src={LinkIcon} className={cx('linkIcon')} alt="" />
        </p>
        {insufficientFunds && <span className={cx('insufficientETH')}>{t('register_wallet.not_enough_balance')}</span>}
        <LegalCompliance
          submitButtonLabel={t('register_wallet.register_wallet').toUpperCase()}
          submitButtonClassName={cx('btn', 'btn-primary', 'actionButton')}
          submitButtonDisabledClassName={cx('disabled')}
          submitButtonOpts={{
            disableLegalCheck: true,
            disableWalletCheck: true,
          }}
          submitButtonComponent={InteractionButton}
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
  setLegalDocumentsAccepted: PropTypes.func.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal),
  registrationGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

RegisterMainnetAddress.defaultProps = {
  gasPrice: Decimal(0),
  registrationGasCost: 0,
}

const enhancer = compose(
  withNamespaces(),
  lifecycle({
    componentDidMount() {
      if (!this.props.currentAccount) {
        this.props.closeModal()
      }
      this.props.requestRegistrationGasCost()
      this.props.requestGasPrice()
    },
    componentDidUpdate() {
      if (this.props.mainnetAddress) {
        this.props.closeModal()
      }
    },
  }),
)

export default enhancer(RegisterMainnetAddress)
