import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Indefinite from 'components/Spinner/Indefinite'
import { getFeatureConfig } from 'utils/features'

import Welcome from './Welcome'
import Integration from './Integration'

import styles from './style.scss'

const { name: applicationName = 'the application' } = getFeatureConfig('tournament')

const cx = classnames.bind(styles)

const SignMessage = ({ t, closeModal }) => (
  <div>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <p>{t('verification.sign_message')}</p>
  </div>
)

SignMessage.propTypes = {
  t: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}

const DeniedMessage = ({
  reason, heading, canRetry, closeModal, setStep, t,
}) => (
  <div className={cx('modal', 'denied')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <h2>{heading || t('verification.headings.denied_default', { applicationName })}</h2>
    <p>{reason}</p>

    {canRetry && (
      <button type="button" className={cx('retryButton')} onClick={() => setStep({ page: 'welcome' })}>
        {t('verification.try_again')}
      </button>
    )}
  </div>
)

DeniedMessage.propTypes = {
  reason: PropTypes.string,
  heading: PropTypes.node,
  closeModal: PropTypes.func.isRequired,
  canRetry: PropTypes.bool,
  setStep: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

DeniedMessage.defaultProps = {
  reason: '',
  heading: undefined,
  canRetry: true,
}

const Steps = {
  welcome: Welcome,
  integration: Integration,
  signMessage: SignMessage,
  denied: DeniedMessage,
}

class OnFido extends Component {
  async componentDidMount() {
    await this.navigateUser()
  }

  async componentDidUpdate(prevProps) {
    const { account } = this.props
    if (account !== prevProps.account) {
      await this.navigateUser()
    }
  }

  navigateUser = async () => {
    const {
      tosAccepted, t, closeModal, setStep, updateUserVerification, account, openModal,
    } = this.props
    const applicantStatus = await updateUserVerification(account)

    if (applicantStatus === 'ACCEPTED' && !tosAccepted) {
      openModal('ModalAcceptTOS')
      return
    }

    if (tosAccepted) {
      if (applicantStatus === 'PENDING_DOCUMENT_UPLOAD') {
        // TOS accepted or not required and process started but not finished - need to restart in order to get a new token
        setStep({
          page: 'denied',
          heading: t('verification.headings.application_not_completed'),
          reason: t('verification.reasons.previous_not_completed'),
        })
        return
      }
      if (applicantStatus === 'WAITING_FOR_APPROVAL') {
        setStep({
          page: 'denied',
          heading: t('verification.headings.waiting_for_approval'),
          reason: t('verification.reasons.verification_pending'),
        })
        return
      }
      if (applicantStatus === 'DENIED') {
        // TOS accepted or not required and application denied
        setStep({
          page: 'denied',
          reason: t('verification.reasons.application_denied'),
        })
        return
      }
      if (applicantStatus === 'ACCEPTED') {
        // TOS accepted and application accepted - should be able to connect now
        // updateUserVerification will set the state entry about a finished verification if it wasnt set before.
        closeModal()
        return
      }
    }

    // TOS not accepted but required, wait until signature and message signature to let the user know if their application was denied or accepted.
    setStep({
      page: 'welcome',
    })
  }

  render() {
    const { step, ...props } = this.props

    const { page, options, ...other } = step

    if (Steps[page]) {
      const StepComponent = Steps[page]
      return <StepComponent {...other} {...props} {...options} />
    }

    return <Indefinite width={64} height={64} />
  }
}

OnFido.propTypes = {
  step: PropTypes.shape({
    page: PropTypes.string.isRequired,
    options: PropTypes.object,
  }).isRequired,
}

export default OnFido
