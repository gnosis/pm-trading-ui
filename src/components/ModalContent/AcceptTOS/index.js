import React from 'react'
import cn from 'classnames/bind'
import { Field, reduxForm, propTypes } from 'redux-form'
import PropTypes from 'prop-types'
import { getFeatureConfig } from 'utils/features'
import Checkbox from 'components/Form/Checkbox'
import style from './AcceptTOS.mod.scss'

const { name = 'the application' } = getFeatureConfig('tournament')

const cx = cn.bind(style)

const AcceptTOS = ({
  closeModal, tosAgreed, ppAgreed, rdAgreed, initProviders, setTermsAndConditionsStatus,
}) => {
  const disabled = !ppAgreed || !tosAgreed || !rdAgreed
  const login = () => {
    setTermsAndConditionsStatus(['TermsOfService.html', 'PrivacyPolicy.html', 'RiskDisclaimerPolicy.html'])
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
          For using { name }, you have to agree with our{' '}
          <a href="/assets/TermsOfService.html" target="_blank">
            terms of service
          </a>{' '}
          and{' '}
          <a href="/assets/PrivacyPolicy.html" target="_blank">
            privacy policy
          </a>
          {', '}
          and{' '}
          <a href="/assets/RiskDisclaimerPolicy.html" target="_blank">
            risk policy
          </a>
        </p>
        <div className={cx('checks')}>
          <Field
            name="agreedWithTOS"
            component={Checkbox}
            className={cx('checkBox')}
          >
            I have read and understood the T&C’s
          </Field>
          <Field name="agreedWithPP" component={Checkbox} className={cx('checkBox')}>
          I have read and understood the Privacy Policy
          </Field>
          <Field
            name="agreedWithRDP"
            component={Checkbox}
            className={cx('checkBox')}
          >
            I have read and understood the Risk Disclaimer
          </Field>
        </div>
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
  setTermsAndConditionsStatus: PropTypes.func.isRequired,
  tosAgreed: PropTypes.bool,
  ppAgreed: PropTypes.bool,
  rdAgreed: PropTypes.bool,
}

const form = {
  form: 'tosAgreement',
  destroyOnUnmount: false,
}

AcceptTOS.defaultProps = {
  tosAgreed: false,
  ppAgreed: false,
  rdAgreed: false,
}

export default reduxForm(form)(AcceptTOS)
