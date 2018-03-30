import React from 'react'
import cn from 'classnames/bind'
import { reduxForm, propTypes } from 'redux-form'
import PropTypes from 'prop-types'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './RegisterWallet.mod.scss'

const cx = cn.bind(style)

const RegisterMainnetAddress = ({ closeModal, initProviders }) => {
  const login = () => {
    initProviders()
    closeModal()
  }

  return (
    <div className={cx('registerWallet')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('registerContainer')}>
        <h4 className={cx('registerHeading')}>Register wallet address</h4>
        <p className={cx('annotation')}>
          Please register your wallet address, where we can send you OLY tokens, and subsequently your GNO reward. Read
          our terms of service for more information
        </p>
        <p className={cx('walletAnnotation')}>Your current Metamask address is:</p>
        <div className={cx('walletAddressContainer')}>
          <img src={WalletIcon} className={cx('walletIcon')} alt="" />
          <h4 className={cx('walletAddress')}>0xe7e3272a84cf3fe180345b9f7234ba705eb5e2ca</h4>
        </div>
        <p className={cx('rinkebyEthAnnotation')}>
          You need Rinkeby ETH to register your wallet address. <br />Rinkeby ETH balance: 0.00 -{' '}
          <a className={cx('faucetLink')} href="http://rinkeby-faucet.com/" target="_blank" rel="noopener noreferrer">
            Request Rinkeby Ether
          </a>
          <img src={LinkIcon} className={cx('linkIcon')} alt="" />
        </p>
        <button className={cx('registerButton')} onClick={login}>
          REGISTER ADDRESS
        </button>
      </div>
    </div>
  )
}

RegisterMainnetAddress.propTypes = {
  ...propTypes,
  closeModal: PropTypes.func.isRequired,
}

const form = {
  form: 'registerMainnetAddress',
}

export default reduxForm(form)(RegisterMainnetAddress)
