import React from 'react'
import cn from 'classnames'
import { Field, reduxForm, propTypes } from 'redux-form'
import PropTypes from 'prop-types'
import TextInput from 'components/Form/TextInput'
import style from './AcceptTOS.less'

const cx = cn.bind(style)

const RegisterMainnetAddress = ({
  closeModal, tosAgreed, ppAgreed, rdAgreed, initProviders,
}) => {
  const disabled = !ppAgreed || !tosAgreed || !rdAgreed
  const login = () => {
    initProviders()
    closeModal()
  }

  return (
    <div className={cx('acceptTOS')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('tosContainer')}>
        <h4 className={cx('acceptHeading')}>Register wallet address</h4>
        <p className={cx('annotation')}>
          Please register your wallet address, where we can send you OLY play tokens and winning GNO tokens in case you
          finish in the top 100. Read our terms of service for more information.
        </p>
        <Field
          name="agreedWithTOS"
          component={TextInput}
          className={cx('checkBox')}
          text="I agree with terms of service"
        />
        <button className={cx('registerButton', { disabled })} disabled={disabled} onClick={login}>
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
