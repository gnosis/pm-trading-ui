import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { lifecycle } from 'recompose'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import { Field, reduxForm, propTypes } from 'redux-form'
import Checkbox from 'components/Form/Checkbox'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import { getFeatureConfig } from 'utils/features'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './RegisterWallet.mod.scss'

const cx = cn.bind(style)
const {
  rewardToken: { symbol: rewardTokenSymbol },
} = getFeatureConfig('rewards')
const { url: termsOfServiceUrl } = getFeatureConfig('termsOfUse') || {}
const { url: riskDisclaimerUrl } = getFeatureConfig('riskDisclaimer') || {}
const { url: privacyPolicyUrl } = getFeatureConfig('privacyPolicy') || {}

const RegisterMainnetAddress = ({
  closeModal,
  currentAccount,
  currentBalance,
  updateMainnetAddress,
  gasPrice,
  registrationGasCost,
  tosAgreed,
  ppAgreed,
  rdAgreed,
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
      .gt(currentBalance || 0) ||
    (!ppAgreed && !!privacyPolicyUrl) ||
    (!tosAgreed && !!termsOfServiceUrl) ||
    (!rdAgreed && !!riskDisclaimerUrl)

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
        <div className={cx('checkBoxContainer')}>
          {!!termsOfServiceUrl && (
            <Field name="agreedWithTOS" component={Checkbox} className={cx('checkBox')}>
              I agree with{' '}
              <a href={termsOfServiceUrl} target="_blank" rel="noopener noreferrer">
                terms of service
              </a>
            </Field>
          )}
          {!!privacyPolicyUrl && (
            <Field name="agreedWithPP" component={Checkbox} className={cx('checkBox')}>
              I agree with{' '}
              <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
            </Field>
          )}
          {!!riskDisclaimerUrl && (
            <Field name="agreedWithRDP" component={Checkbox} className={cx('checkBox')}>
              I have read the{' '}
              <a href={riskDisclaimerUrl} target="_blank" rel="noopener noreferrer">
                risk disclaimer policy
              </a>
            </Field>
          )}
        </div>
        <InteractionButton
          onClick={handleRegistration}
          className={cx('btn', 'btn-primary', 'actionButton')}
          disabled={disabled}
        >
          REGISTER ADDRESS
        </InteractionButton>
      </div>
    </div>
  )
}

RegisterMainnetAddress.propTypes = {
  ...propTypes,
  closeModal: PropTypes.func.isRequired,
  currentAccount: PropTypes.string.isRequired,
  currentBalance: PropTypes.string.isRequired,
  updateMainnetAddress: PropTypes.func.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal),
  registrationGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tosAgreed: PropTypes.bool,
  ppAgreed: PropTypes.bool,
  rdAgreed: PropTypes.bool,
}

RegisterMainnetAddress.defaultProps = {
  tosAgreed: false,
  ppAgreed: false,
  rdAgreed: false,
  gasPrice: Decimal(0),
  registrationGasCost: 0,
}

const form = {
  form: 'tosAgreement',
}

export default reduxForm(form)(lifecycle({
  componentDidMount() {
    this.props.requestRegistrationGasCost()
    this.props.requestGasPrice()
  },
})(RegisterMainnetAddress))
