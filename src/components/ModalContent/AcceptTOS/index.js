import React from 'react'
import cn from 'classnames'
import { Field, reduxForm, propTypes } from 'redux-form'
import PropTypes from 'prop-types'
import Checkbox from 'components/FormCheckbox'
import style from './AcceptTOS.mod.scss'

const cx = cn.bind(style)

const AcceptTOS = ({
  closeModal, tosAgreed, ppAgreed, rdAgreed, initProviders,
}) => {
  const disabled = !ppAgreed || !tosAgreed || !rdAgreed
  const login = () => {
    initProviders()
    closeModal()
  }
  const handleCloseModal = () => closeModal()

  return (
    <div className={cx('acceptTOS')}>
      <button className={cx('closeButton')} onClick={handleCloseModal} />
      <div className={cx('tosContainer')}>
        <h4 className={cx('acceptHeading')}>Terms of service and privacy policy</h4>
        <p className={cx('annotation')}>
          For using Gnosis Trading Interface, you have to agree with our{' '}
          <a href="/TermsOfService.html" target="_blank">
            terms of service
          </a>{' '}
          and{' '}
          <a href="/PrivacyPolicy.html" target="_blank">
            privacy policy
          </a>
          {', '}
          and{' '}
          <a href="/RiskDisclaimerPolicy.html" target="_blank">
            risk policy
          </a>
        </p>
        <Field
          name="agreedWithTOS"
          component={Checkbox}
          className={cx('checkBox')}
          text="I agree with terms of service"
        />
        <Field name="agreedWithPP" component={Checkbox} className={cx('checkBox')} text="I agree with privacy policy" />
        <Field
          name="agreedWithRDP"
          component={Checkbox}
          className={cx('checkBox')}
          text="I have read the risk disclaimer policy"
        />
        <button className={cx('loginButton', { disabled })} disabled={disabled} onClick={login}>
          LOGIN
        </button>
      </div>
    </div>
  )
}

AcceptTOS.propTypes = {
  ...propTypes,
  closeModal: PropTypes.func.isRequired,
  tosAgreed: PropTypes.bool,
  ppAgreed: PropTypes.bool,
  rdAgreed: PropTypes.bool,
}

const form = {
  form: 'tosAgreement',
}

AcceptTOS.defaultProps = {
  tosAgreed: false,
  ppAgreed: false,
  rdAgreed: false,
}

export default reduxForm(form)(AcceptTOS)
