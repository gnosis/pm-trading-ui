import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import { EMAIL_REGEXP } from 'utils/constants'
import { Field } from 'redux-form'

import { TextInput, MandatoryHint } from 'components/Form'
import LegalCompliance from 'containers/LegalCompliance'
import i18n from 'i18n'

import style from './style.scss'

const required = val => (val && val.length > 0 ? undefined : i18n.t('verification.validation.required'))
const isEmail = val => (val && EMAIL_REGEXP.test(val) ? undefined : i18n.t('verification.validation.valid_email'))

const validators = funcs => (val) => {
  let foundError
  funcs.forEach((func) => {
    const error = func(val)
    if (error !== undefined) {
      foundError = error
      return false
    }
    return true
  })

  return foundError
}

const { name = 'the application' } = getFeatureConfig('tournament')
const cx = classnames.bind(style)

const emailValidations = validators([required, isEmail])

const ERROR_STYLE = {
  fontSize: '10px',
  marginBottom: '2px',
}

const Welcome = ({
  setLegalDocumentsAccepted, closeModal, invalid, submit, tosAccepted, t,
}) => (
  <div className={cx('modal', 'onfido', 'welcome')}>
    <h4 className={cx('heading')}>Start verification process</h4>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <div className={cx('form')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <Field
            component={TextInput}
            name="firstName"
            validate={required}
            errorStyle={ERROR_STYLE}
            label={(
              <span>
                {t('verification.form.firstname')}
                <MandatoryHint />
              </span>
            )}
          />
        </div>
        <div className={cx('col-md-6')}>
          <Field
            component={TextInput}
            name="lastName"
            validate={required}
            errorStyle={ERROR_STYLE}
            label={(
              <span>
                {t('verification.form.lastname')}
                <MandatoryHint />
              </span>
            )}
          />
        </div>
      </div>
      <div className={cx('row')}>
        <div className={cx('col-md-12')}>
          <Field
            component={TextInput}
            name="email"
            validate={emailValidations}
            errorStyle={ERROR_STYLE}
            label={(
              <span>
                {t('verification.form.email')}
                <MandatoryHint />
              </span>
            )}
          />
        </div>
      </div>
      <div className={cx('row')}>
        <div className={cx('col-md-12')}>
          {!tosAccepted ? (
            <LegalCompliance
              showExplanation
              submitButtonClassName={cx('submitButton')}
              submitButtonDisabledClassName={cx('disabled')}
              submitButtonLabel="Verify"
              applicationName={name}
              disabled={invalid}
              onSubmitAcceptedDocs={(docs) => {
                setLegalDocumentsAccepted(docs)
                submit()
              }}
            />
          ) : (
            <div>
              <p>{t('verification.form.already_accepted_tos')}</p>
              <br />
              <button
                type="button"
                className={cx('submitButton', { disabled: invalid })}
                disabled={invalid}
                onClick={submit}
              >
                {t('verification.form.verify')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

Welcome.propTypes = {
  setLegalDocumentsAccepted: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  tosAccepted: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

Welcome.defaultProps = {
  invalid: true,
}

export default Welcome
