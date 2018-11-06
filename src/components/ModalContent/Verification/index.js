import React from 'react'
import PropTypes from 'prop-types'

import VerificationHandler from 'verification'

import classnames from 'classnames/bind'
import styles from './Verification.scss'

const cx = classnames.bind(styles)

const ErrorComponent = ({ closeModal }) => (
  <>
    <h3 className={cx('heading')}>Our User Verification Integration could not be loaded.</h3>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <p className={cx('text')}>Sorry for the inconvience, please try again later!</p>
  </>
)

const ModalVerification = props => (
  <div className={cx('verification')}>
    <VerificationHandler errorComponent={ErrorComponent} {...props} />
  </div>
)

ModalVerification.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

ModalVerification.defaultProps = {
}

export default ModalVerification
