import React from 'react'
import PropTypes from 'prop-types'

import VerificationHandler from 'verification'

import classnames from 'classnames/bind'
import styles from './Verification.scss'

const cx = classnames.bind(styles)

const ErrorComponent = () => (
  <>
    <h3 className={cx('heading')}>Our User Verification Integration could not be loaded.</h3>
    <p className={cx('text')}>Sorry for the inconvience, please try again later!</p>
  </>
)

const ModalVerification = ({ closeModal }) => (
  <div className={cx('verification')}>
    <button className={cx('closeButton')} type="button" onClick={closeModal} />
    <VerificationHandler errorComponent={ErrorComponent} />
  </div>
)

ModalVerification.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

ModalVerification.defaultProps = {
}

export default ModalVerification
