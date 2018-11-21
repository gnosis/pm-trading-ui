import React from 'react'
import { withNamespaces } from 'react-i18next'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import web3 from 'web3'

import { updateMainnetAddress } from 'store/actions/account'
import { closeModal as closeModalAction } from 'store/actions/modal'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'

import TextInput from 'components/Form/TextInput'
import TextInputAdornment from 'components/Form/TextInputAdornment'
import InteractionButton from 'containers/InteractionButton'

import style from './RegisterWalletUport.scss'

const cx = cn.bind(style)

const textInputAdornmentStyles = {
  padding: 0,
}

const inputWrapperStyles = {
  border: 'none',
  margin: 0,
}

const inputErrorStyles = {
  bottom: -30,
}

const SetMainnetAddress = ({
  submitting, handleSubmit, error, submitFailed, closeModal, invalid, t,
}) => (
  <div className={cx('setMainnetAddress')}>
    <div className={cx('setMainnetAddressModal')}>
      <button type="button" className={cx('closeButton')} onClick={closeModal} />
      <form onSubmit={handleSubmit}>
        <h1 className={cx('heading')}>{t('register_uport.heading')}</h1>
        <p className={cx('disclaimer')}>
          {t('register_uport.disclaimer')}
        </p>

        <Field
          component={TextInput}
          className={cx('input')}
          name="mainnetAddress"
          placeholder={t('register_uport.ethereum_wallet_address')}
          wrapperStyle={inputWrapperStyles}
          errorStyle={inputErrorStyles}
          startAdornment={(
            <TextInputAdornment position="start" style={textInputAdornmentStyles}>
              <img src={WalletIcon} alt="" />
            </TextInputAdornment>
          )}
        />
        <InteractionButton
          type="submit"
          className={cx('btn', 'btn-primary', 'submitButton')}
          loading={submitting}
          disabled={invalid}
        >
          {t('register_uport.save_address')}
        </InteractionButton>
        {error && <p className={cx('error')}>{error}</p>}
        {submitFailed
          && !submitting && (
          <p className={cx('error')}>{t('register_uport.failed_tx_ask_support')}</p>
        )}
      </form>
    </div>
  </div>
)

SetMainnetAddress.propTypes = {
  ...reduxFormPropTypes,
  closeModal: PropTypes.func.isRequired,
}

const FORM = {
  form: 'setMainnetAddressForm',
  onSubmit: async (values, dispatch) => {
    await dispatch(updateMainnetAddress(values.mainnetAddress))
    return dispatch(closeModalAction())
  },
  validate: values => (web3.utils.isAddress(values.mainnetAddress) ? {} : { mainnetAddress: 'register_uport.enter_valid_address' }),
}

const enhancer = compose(
  withNamespaces(),
  reduxForm(FORM),
)

export default enhancer(SetMainnetAddress)
