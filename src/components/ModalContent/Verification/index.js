import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import VerificationHandler from 'verification'

import classnames from 'classnames/bind'
import styles from './Verification.scss'

const cx = classnames.bind(styles)

const ErrorComponent = ({ closeModal, t }) => (
  <>
    <h3 className={cx('heading')}>{t('verification.errors.not_loaded')}</h3>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <p className={cx('text')}>{t('verification.errors.not_found')}</p>
  </>
)

const ModalVerification = props => (
  <div className={cx('verification')}>
    <VerificationHandler errorComponent={ErrorComponent} {...props} />
  </div>
)

ModalVerification.propTypes = {
  closeModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(ModalVerification)
