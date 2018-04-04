import React from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'

import { updateMainnetAddress } from 'actions/account'
import { closeModal as closeModalAction } from 'actions/modal'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'

import { HEX_VALUE_REGEX } from 'utils/constants'

import TextInput from 'components/Form/TextInput'
import TextInputAdornment from 'components/Form/TextInputAdornment'
import InteractionButton from 'containers/InteractionButton'

import style from './RegisterWalletUport.mod.scss'

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
  submitting, handleSubmit, error, submitFailed, closeModal, invalid,
}) => (
  <div className={cx('setMainnetAddress')}>
    <div className={cx('setMainnetAddressModal')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <form onSubmit={handleSubmit}>
        <h1 className={cx('heading')}>Setup claim Address</h1>
        <p className={cx('disclaimer')}>
          Please register your Metamask address, where we can send your winning GNO tokens in case you finished in the
          top 100. <br /> Please note that you can register your address <em>only once</em>.
        </p>

        <Field
          component={TextInput}
          className={cx('input')}
          name="mainnetAddress"
          placeholder="Ethereum address"
          wrapperStyle={inputWrapperStyles}
          errorStyle={inputErrorStyles}
          startAdornment={
            <TextInputAdornment position="start" style={textInputAdornmentStyles}>
              <img src={WalletIcon} alt="" />
            </TextInputAdornment>
          }
        />
        <InteractionButton
          type="submit"
          className={cx('btn', 'btn-primary', 'submitButton')}
          loading={submitting}
          disabled={invalid}
        >
          Save Address
        </InteractionButton>
        {error && <p className={cx('error')}>{error}</p>}
        {submitFailed &&
          !submitting && (
          <p className={cx('error')}>Sorry, the transaction failed. Please try again later or contact us!</p>
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
  validate: values =>
    (HEX_VALUE_REGEX.test(values.mainnetAddress) ? {} : { mainnetAddress: 'Please enter a valid address' }),
}

export default reduxForm(FORM)(SetMainnetAddress)
