import React from 'react'
import classnames from 'classnames/bind'
import { getFeatureConfig } from 'utils/features'
import { EMAIL_REGEXP } from 'utils/constants'
import { Field } from 'redux-form'

import { TextInput, MandatoryHint } from 'components/Form'
import LegalCompliance from 'containers/LegalCompliance'

import style from './Welcome.scss'

const required = val => (val && val.length > 0 ? undefined : 'This field is required')
const isEmail = val => ((!val || EMAIL_REGEXP.test(val)) ? undefined : 'Requires a valid E-Mail address')

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

const ERROR_STYLE = {
  fontSize: '10px',
  marginBottom: '2px',
}

const Welcome = ({
  setLegalDocumentsAccepted, setStep, closeModal, invalid, submit,
}) => (
  <div className={cx('modal', 'onfido', 'welcome')}>
    <h4 className={cx('heading')}>Start verification process</h4>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <div className={cx('form')}>
      <div className={cx('row')}>
        <div className={cx('col-md-6')}>
          <Field component={TextInput} name="firstName" validate={required} errorStyle={ERROR_STYLE} label={<span>First Name<MandatoryHint /></span>} />
        </div>
        <div className={cx('col-md-6')}>
          <Field component={TextInput} name="lastName" validate={required} errorStyle={ERROR_STYLE} label={<span>Last Name<MandatoryHint /></span>} />
        </div>
      </div>
      <div className={cx('row')}>
        <div className={cx('col-md-12')}>
          <Field component={TextInput} name="email" validate={validators([required, isEmail])} errorStyle={ERROR_STYLE} label={<span>E-Mail<MandatoryHint /></span>} />
        </div>
      </div>
      <div className={cx('row')}>
        <div className={cx('col-md-12')}>
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
        </div>
      </div>
    </div>
  </div>
)

export default Welcome
